import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import MealFoods from '../mealFoods';

Meteor.publish('mealFoods.inTrip', (tripId) => {
  check(tripId, String);
  return MealFoods.find({ tripId });
});
