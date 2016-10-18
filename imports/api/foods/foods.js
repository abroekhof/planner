import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Foods = new Mongo.Collection('foods');

export const foodBase = new SimpleSchema({
  name: {
    type: String,
    max: 100,
  },
  calories: {
    type: Number,
    decimal: true,
  },
  caloriesPerWeight: {
    type: Number,
    decimal: true,
  },
  caloriesFromFat: {
    type: Number,
    decimal: true,
  },
  servingsPerContainer: {
    type: Number,
    decimal: true,
  },
  totalFat: {
    type: Number,
    decimal: true,
  },
  saturatedFat: {
    type: Number,
    decimal: true,
  },
  cholesterol: {
    type: Number,
    decimal: true,
  },
  sodium: {
    type: Number,
    decimal: true,
  },
  potassium: {
    type: Number,
    decimal: true,
  },
  totalCarbohydrate: {
    type: Number,
    decimal: true,
  },
  dietaryFiber: {
    type: Number,
    decimal: true,
  },
  sugars: {
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
    decimal: true,
  },
});

Foods.schema = new SimpleSchema([
  {
    userId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    verified: {
      type: Boolean,
      defaultValue: false,
    },
    duplicateOf: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
  },
  foodBase,
]);

Foods.attachSchema(Foods.schema);

export default Foods;
