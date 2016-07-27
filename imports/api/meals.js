import { Mongo } from 'meteor/mongo';

import { MealFoods } from './mealFoods.js';
import { Days } from './days.js';

export const Meals = new Mongo.Collection('meals');

Meals.helpers({
  mealFoods() {
    return MealFoods.find({ mealId: this._id });
  },
  day() {
    return Days.findOne(this.dayId);
  },
});
