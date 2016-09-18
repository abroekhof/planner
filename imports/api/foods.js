import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Foods = new Mongo.Collection('foods');

Foods.schema = new SimpleSchema({
  name: {
    type: String,
    max: 100,
  },
  calories: {
    type: Number,
    decimal: true,
  },
  protein: {
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

if (Meteor.isServer) {
  Meteor.publish('foods', () => (
    Foods.find()
  ));
}

Meteor.methods({
  'foods.insert': function foodsInsert(name, calories, protein, weight) {
    check(name, String);
    check(calories, Number);
    check(protein, Number);
    check(weight, Number);

    Foods.insert({
      name,
      calories,
      protein,
      weight,
    });
  },
  'foods.remove': function foodsRemove(foodId) {
    check(foodId, String);

    Foods.remove(foodId);
  },
});
