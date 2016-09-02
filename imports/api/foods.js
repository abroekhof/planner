import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

export const Foods = new Mongo.Collection('foods');

Foods.schema = new SimpleSchema({
  name: {
    type: String,
    max: 100,
  },
  calories: {
    type: Number,
    defaultValue: 3000,
  },
  protein: {
    type: Number,
    defaultValue: 100,
  },
  weight: {
    type: Number,
    defaultValue: 100,
  },
});

Foods.attachSchema(Foods.schema);

if (Meteor.isServer) {
  Meteor.publish('foods', () => (
    Foods.find()
  ));
}

Meteor.methods({
  'foods.insert'(name, calories, protein, weight) {
    check(name, String);
    check(calories, Number);
    check(protein, Number);
    check(weight, Number);

    Foods.insert({
      name,
      calories,
      protein,
      weight,
      createdAt: new Date(),
    });
  },
  'foods.remove'(foodId) {
    check(foodId, String);

    Foods.remove(foodId);
  },
});
