import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Days from '../days/days.js';
import Meals from '../meals/meals.js';
import MealFoods from '../mealFoods/mealFoods.js';

const newTripName = 'New Trip';

class TripsCollection extends Mongo.Collection {
  remove(selector, callback) {
    // also remove all child days
    Days.remove({ tripId: selector });
    return super.remove(selector, callback);
  }
}

const Trips = new TripsCollection('trips');

Trips.helpers({
  days() {
    return Days.find({ tripId: this._id });
  },
  meals() {
    return Meals.find({ tripId: this._id });
  },
  mealFoods() {
    return MealFoods.find({ tripId: this._id });
  },
  editableBy(userId) {
    if (!this.userId) {
      return true;
    }
    return this.userId === userId;
  },
  edited() {
    if (this.name !== newTripName) {
      return true;
    }
    if (this.days().count() > 1) {
      return true;
    }
    if (this.mealFoods().count() > 0) {
      return true;
    }
    return false;
  },
});

if (Meteor.isServer) {
  Meteor.publish('trips', function publishTrips() {
    return Trips.find({
      $or: [
        { sessionId: this.connection.id },
        { $and: [
            { userId: this.userId },
            { userId: { $ne: null } },
        ] },
      ],
    });
  });
}

Trips.schema = new SimpleSchema({
  name: {
    type: String,
    max: 100,
    defaultValue: newTripName,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  calsPerDay: {
    type: Number,
    defaultValue: 3000,
  },
  useOz: {
    type: Boolean,
    defaultValue: true,
  },
  proteinPerDay: {
    type: Number,
    defaultValue: 100,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  sessionId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});

Trips.attachSchema(Trips.schema);

export default Trips;

Meteor.methods({
  'trips.insert': function tripsInsert() {
    let sessionId = Random.id();
    if (!this.isSimulation) { sessionId = this.connection.id; }
    const tripId = Trips.insert({
      name: newTripName,
      calsPerDay: 3000,
      proteinPerDay: 100,
      createdAt: new Date(),
      userId: this.userId,
      sessionId,
    });
    Meteor.call('days.insert', tripId);
    // return trip id to be used for routing
    return tripId;
  },
  'trips.remove': function tripsRemove(tripId) {
    check(tripId, String);
    Trips.remove(tripId);
  },
  'trips.updateTarget': function tripsUpdateTarget(tripId, target, value) {
    check(tripId, String);
    check(target, String);
    check(value, Number);
    Trips.update(
      tripId,
      { $set: { [target]: value } }
    );
  },
  'trips.updateUseOz': function tripsUpdateUseOz(tripId, useOz) {
    check(tripId, String);
    check(useOz, Boolean);
    Trips.update(
      tripId,
      { $set: { useOz } }
    );
  },
  'trips.updateName': function tripsUpdateName(tripId, name) {
    check(tripId, String);
    check(name, String);
    Trips.update(
      tripId,
      { $set: { name } }
    );
  },
  'trips.updateUserId': function tripsUpdateName() {
    let sessionId = Random.id();
    if (!this.isSimulation) { sessionId = this.connection.id; }

    const trip = Trips.findOne({ sessionId });
    if (!trip) { return; }
    // if the trip was not edited and the user has other trips, delete it.
    if (!trip.edited() && !!Trips.findOne({ userId: this.userId })) {
      Trips.remove(trip._id);
      return;
    }
    Trips.update(
      trip._id,
      { $set: { userId: this.userId } }
    );
    Days.update(
      { tripId: trip._id },
      { $set: { userId: this.userId } },
      { multi: true }
    );
    Meals.update(
      { tripId: trip._id },
      { $set: { userId: this.userId } },
      { multi: true }
    );
    MealFoods.update(
      { tripId: trip._id },
      { $set: { userId: this.userId } },
      { multi: true }
    );
  },
});
