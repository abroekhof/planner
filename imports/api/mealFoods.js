import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Foods from './foods.js';
import Meals from './meals.js';

const MealFoods = new Mongo.Collection('mealFoods');

MealFoods.schema = new SimpleSchema({
  dayId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  mealId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  foodId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  qty: {
    type: Number,
    defaultValue: 1,
    decimal: true,
  },
  name: {
    type: String,
    max: 100,
  },
  calories: {
    type: Number,
    defaultValue: 3000,
    decimal: true,
  },
  protein: {
    type: Number,
    defaultValue: 100,
    decimal: true,
  },
  weight: {
    type: Number,
    defaultValue: 100,
    decimal: true,
  },
});

MealFoods.attachSchema(MealFoods.schema);

export default MealFoods;

Meteor.methods({
  'mealFoods.insert': function mealFoodsInsert(foodId, mealId, dayId, qty) {
    check(foodId, String);
    check(mealId, String);
    check(dayId, String);
    check(qty, Number);
    const food = Foods.findOne(foodId);
    MealFoods.insert(
      {
        foodId,
        mealId,
        dayId,
        userId: this.userId,
        qty,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        weight: food.weight,
      }
    );
  },
  'mealFoods.remove': function mealFoodsRemove(mealFoodId) {
    check(mealFoodId, String);
    MealFoods.remove(mealFoodId);
  },
  'mealFoods.updateQty': function mealFoodsUpdateQty(mealFoodId, qty) {
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
