import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const MealFoods = new Mongo.Collection('mealFoods');

Meteor.methods({
  'mealFoods.insert'(foodId, mealId, dayId, qty) {
    check(foodId, String);
    check(mealId, String);
    check(dayId, String);
    check(qty, Number);
    MealFoods.update(
      {
        foodId,
        mealId,
        dayId,
      }, {
        $inc: { qty },
      }, {
        upsert: true,
      }
    );
  },
  'mealFoods.remove'(mealFoodId) {
    check(mealFoodId, String);
    MealFoods.remove(mealFoodId);
  },
});
