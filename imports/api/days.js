import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Meals } from './meals.js';

class DaysCollection extends Mongo.Collection {
  remove(selector, callback) {
    Meals.remove({ dayId: selector });
    return super.remove(selector, callback);
  }
}

export const Days = new DaysCollection('days');

if (Meteor.isServer) {
  Meteor.publishComposite('days', {
    find() { return Days.find(); },
    children: [
      {
        find(day) {
          return Meals.find({ dayId: day._id });
        },
      },
    ],
  });
}

Meteor.methods({
  'days.insert'() {
    Days.insert({ createdAt: new Date() }, (err, dayId) => {
      ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].forEach((name) => {
        Meals.insert({
          dayId,
          name,
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
