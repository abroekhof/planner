import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

import Trips, { newTripName } from './trips';
import Days from '../days/days';
import MealFoods from '../mealFoods/mealFoods';

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
    Days.remove({ tripId });
    MealFoods.remove({ tripId });
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
    MealFoods.update(
      { tripId: trip._id },
      { $set: { userId: this.userId } },
      { multi: true }
    );
  },
});
