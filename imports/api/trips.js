import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
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

Meteor.methods({
  'trips.insert'() {
    return Trips.insert({
      name: 'New Trip',
      calsPerDay: 0,
      proteinPerDay: 0,
      createdAt: new Date(),
    });
  },
  'trips.remove'(tripId) {
    check(tripId, String);
    Days.remove({ tripId });
    Meals.remove({ tripId });
    MealFoods.remove({ tripId });
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
