import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Days from './days.js';
import Meals from './meals.js';
import MealFoods from './mealFoods.js';

class TripsCollection extends Mongo.Collection {}

const Trips = new TripsCollection('trips');

Trips.helpers({
  days() {
    return Days.find({ tripId: this._id });
  },
});

if (Meteor.isServer) {
  Meteor.publish('trips', function publishTrips() {
    return Trips.find({ $or: [{ sessionId: this.connection.id }, { userId: this.userId }] });
  });
}

Trips.schema = new SimpleSchema({
  name: {
    type: String,
    max: 100,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  calsPerDay: {
    type: Number,
    defaultValue: 3000,
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
      name: 'New Trip',
      calsPerDay: 3000,
      proteinPerDay: 100,
      createdAt: new Date(),
      userId: this.userId,
      sessionId,
    });
    // insert a day to get things started
    Meteor.call('days.insert', tripId);
    // return trip id to be used for routing
    return tripId;
  },
  'trips.remove': function tripsRemove(tripId) {
    check(tripId, String);
    Days.remove({ tripId });
    Meals.remove({ tripId });
    MealFoods.remove({ tripId });
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
  'trips.updateName': function tripsUpdateName(tripId, name) {
    check(tripId, String);
    check(name, String);
    Trips.update(
      tripId,
      { $set: { name } }
    );
  },
  'trips.updateUserId': function tripsUpdateName(tripId) {
    check(tripId, String);
    Trips.update(
      tripId,
      { $set: { userId: this.userId } }
    );
  },
});
