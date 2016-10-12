import { Mongo } from 'meteor/mongo';
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

MealFoods.helpers({
  food() {
    return Foods.findOne(this.foodId);
  },
});

MealFoods.attachSchema(MealFoods.schema);

export default MealFoods;
