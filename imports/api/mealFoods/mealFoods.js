import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Foods, { foodBase } from '../foods/foods';

const MealFoods = new Mongo.Collection('mealFoods');

MealFoods.schema = new SimpleSchema([
  {
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
  },
  foodBase,
]);

MealFoods.helpers({
  food() {
    return Foods.findOne(this.foodId);
  },
});

MealFoods.attachSchema(MealFoods.schema);

export default MealFoods;
