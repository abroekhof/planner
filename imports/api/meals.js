import { Mongo } from 'meteor/mongo';

import { MealFoods } from './mealFoods.js';
import { Days } from './days.js';

class MealsCollection extends Mongo.Collection {
  remove(selector, callback) {
    // also remove all child mealFoods
    MealFoods.remove({ mealId: selector });
    return super.remove(selector, callback);
  }
}

export const Meals = new MealsCollection('meals');

Meals.helpers({
  mealFoods() {
    return MealFoods.find({ mealId: this._id });
  },
  day() {
    return Days.findOne(this.dayId);
  },
});
