import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Foods from '../foods/foods';

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
    type: Number,
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
    optional: true,
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

if (Meteor.isServer) {
  Meteor.publish('mealFoods.inTrip', (tripId) => {
    check(tripId, String);
    return MealFoods.find({ tripId });
  });
}

Meteor.methods({
  'mealFoods.insert': function mealFoodsInsert(foodId, tripId, mealId, dayId, qty) {
    check(tripId, String);
    check(foodId, String);
    check(mealId, Number);
    check(dayId, String);
    check(qty, Number);
    const food = Foods.findOne(foodId);
    MealFoods.upsert(
      {
        tripId,
        foodId,
        mealId,
        dayId,
        userId: this.userId,
        name: food.name,
        calories: food.calories,
        caloriesPerWeight: food.caloriesPerWeight,
        protein: food.protein,
        proteinPerWeight: food.proteinPerWeight,
        weight: food.weight,
      },
      { $inc: { qty } },
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
});
