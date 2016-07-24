import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Meals } from './meals.js';

class DaysCollection extends Mongo.Collection {}

export const Days = new DaysCollection('days');

Meteor.methods({
  'days.insert'() {
    Days.insert({ createdAt: new Date() }, (err, day) => {
      ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].forEach((meal) => {
        Meals.insert({
          day,
          name: meal,
          createdAt: 2,
        });
      });
    });
  },
  'days.remove'(dayId) {
    check(dayId, String);
    Days.remove(dayId);
  },
});
