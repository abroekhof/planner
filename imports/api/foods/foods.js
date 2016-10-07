import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Foods = new Mongo.Collection('foods');

Foods.schema = new SimpleSchema({
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

Foods.attachSchema(Foods.schema);

export default Foods;
