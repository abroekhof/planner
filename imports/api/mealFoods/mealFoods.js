import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Foods from '../foods/foods.js';
import Meals from '../meals/meals.js';

const MealFoods = new Mongo.Collection('mealFoods');

MealFoods.schema = new SimpleSchema({
  tripId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: false,
  },
  dayId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  mealId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  foodId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
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
  caloriesPerWeight: {
    type: Number,
    decimal: true,
  },
  protein: {
    type: Number,
    decimal: true,
  },
  proteinPerWeight: {
    type: Number,
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
  'mealFoods.insert': function mealFoodsInsert(foodId, tripId, mealId, dayId, qty) {
    check(tripId, String);
    check(foodId, String);
    check(mealId, String);
    check(dayId, String);
    check(qty, Number);
    const food = Foods.findOne(foodId);
    MealFoods.insert(
      {
        tripId,
        foodId,
        mealId,
        dayId,
        userId: this.userId,
        qty,
        name: food.name,
        calories: food.calories,
        caloriesPerWeight: food.caloriesPerWeight,
        protein: food.protein,
        proteinPerWeight: food.proteinPerWeight,
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
