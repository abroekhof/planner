import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Foods = new Mongo.Collection('foods');

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
