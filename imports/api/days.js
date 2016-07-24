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
  // This code only runs on the server
  Meteor.publish('days', () => (
    Days.find()
  ));
}

Meteor.methods({
  'days.insert'() {
    Days.insert({ createdAt: new Date() }, (err, dayId) => {
      ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].forEach((meal) => {
        Meals.insert({
          dayId,
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
