import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { Foods } from './foods.js';
import { Meals } from './meals.js';

export const MealFoods = new Mongo.Collection('mealFoods');

Meteor.methods({
  'mealFoods.insert'(foodId, mealId, dayId, qty) {
    check(foodId, String);
    check(mealId, String);
    check(dayId, String);
    check(qty, Number);
    const food = Foods.findOne(foodId);
    MealFoods.update(
      {
        foodId,
        mealId,
        dayId,
      }, {
        $inc: { qty },
        $set: { food },
      }, {
        upsert: true,
      }
    );
  },
  'mealFoods.remove'(mealFoodId) {
    check(mealFoodId, String);
    MealFoods.remove(mealFoodId);
  },
  'mealFoods.updateQty'(mealFoodId, qty) {
    check(mealFoodId, String);
    check(qty, Number);
    MealFoods.update(
      mealFoodId,
      { $set: { qty } }
    );
  },
});

MealFoods.helpers({
  food() {
    return Foods.findOne(this.foodId);
  },
  meal() {
    return Meals.findOne(this.mealId);
  },
});
