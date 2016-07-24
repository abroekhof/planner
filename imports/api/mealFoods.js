import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

export const MealFoods = new Mongo.Collection('mealFoods');

Meteor.methods({
  'mealFoods.insert'() {
    MealFoods.insert({ createdAt: new Date() });
  },
  'mealFoods.remove'(mealFoodId) {
    check(mealFoodId, String);
    MealFoods.remove(mealFoodId);
  },
});
