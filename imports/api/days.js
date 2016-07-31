import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Meals } from './meals.js';
import { MealFoods } from './mealFoods.js';

class DaysCollection extends Mongo.Collection {
  remove(selector, callback) {
    // also remove all child meals
    Meals.remove({ dayId: selector });
    return super.remove(selector, callback);
  }
}

export const Days = new DaysCollection('days');

Days.helpers({
  meals() {
    return Meals.find({ dayId: this._id });
  },
  mealFoods() {
    return MealFoods.find({ dayId: this._id });
  },
});

if (Meteor.isServer) {
  Meteor.publishComposite('days', {
    find() { return Days.find(); },
    children: [
      {
        find(day) { return day.meals(); },
        children: [
          {
            find(meal) { return meal.mealFoods(); },
          },
        ],
      },
    ],
  });

  Meteor.publishComposite('days.inTrip', (tripId) => (
    { find() { return Days.find({ tripId }); },
      children: [
        {
          find(day) { return day.meals(); },
          children: [{ find(meal) { return meal.mealFoods(); } }],
        },
      ],
    })
  );
}

Meteor.methods({
  'days.insert'(tripId) {
    check(tripId, String);
    Days.insert({ tripId, createdAt: new Date() }, (err, dayId) => {
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
