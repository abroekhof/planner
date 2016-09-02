import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Days } from './days.js';
import { Meals } from './meals.js';
import { MealFoods } from './mealFoods.js';

class TripsCollection extends Mongo.Collection {}

export const Trips = new TripsCollection('trips');

Trips.helpers({
  days() {
    return Days.find({ tripId: this._id });
  },
});

if (Meteor.isServer) {
  Meteor.publish('trips', () => (
    Trips.find()
  ));
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
});

Trips.attachSchema(Trips.schema);

Meteor.methods({
  'trips.insert'() {
    const tripId = Trips.insert({
      name: 'New Trip',
      calsPerDay: 3000,
      proteinPerDay: 100,
      createdAt: new Date(),
    });
    // insert a day to get things started
    const dayId = Meteor.call('days.insert', tripId);
    Meteor.call('days.updateResupply', dayId, 0);
    // return trip id to be used for routing
    return tripId;
  },
  'trips.remove'(tripId) {
    check(tripId, String);
    Days.remove({ tripId });
    Meals.remove({ tripId });
    MealFoods.remove({ tripId });
    Trips.remove(tripId);
  },
  'trips.updateTarget'(tripId, target, value) {
    check(tripId, String);
    check(target, String);
    check(value, Number);
    Trips.update(
      tripId,
      { $set: { [target]: value } }
    );
  },
  'trips.updateName'(tripId, name) {
    check(tripId, String);
    check(name, String);
    Trips.update(
      tripId,
      { $set: { name } }
    );
  },
});
