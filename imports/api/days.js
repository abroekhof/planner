import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Meals from './meals.js';
import MealFoods from './mealFoods.js';

class DaysCollection extends Mongo.Collection {
  remove(selector, callback) {
    // also remove all child meals
    Meals.remove({ dayId: selector });
    return super.remove(selector, callback);
  }
}

const Days = new DaysCollection('days');

Days.schema = new SimpleSchema({
  resupply: {
    type: Number,
    optional: true,
  },
  tripId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
});

Days.attachSchema(Days.schema);

Days.helpers({
  meals() {
    return Meals.find({ dayId: this._id });
  },
  mealFoods() {
    return MealFoods.find({ dayId: this._id });
  },
});

export default Days;

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
  'days.insert': function daysInsert(tripId) {
    check(tripId, String);
    const id = Days.insert({ tripId, createdAt: new Date() }, (err, dayId) => {
      ['Breakfast', 'Lunch', 'Dinner'].forEach((name) => {
        Meals.insert({
          dayId,
          name,
        });
      });
    });
    return id;
  },
  'days.remove': function daysRemove(dayId) {
    check(dayId, String);
    Days.remove(dayId);
  },
  'days.updateResupply': function daysUpdateResupply(dayId, resupply) {
    check(dayId, String);
    check(resupply, Number);
    Days.update(
      dayId,
      { $set: { resupply } }
    );
  },
  'days.removeResupply': function daysRemoveResupply(dayId) {
    check(dayId, String);
    Days.update(
      dayId,
      { $unset: { resupply: '' } }
    );
  },
  'days.duplicate': function daysDuplicate(dayId) {
    check(dayId, String);
    // find the relevant day
    const day = Days.findOne(dayId);
    const newDay = JSON.parse(JSON.stringify(day));
    // assign the new day an ID
    newDay._id = Random.id();
    newDay.createdAt = new Date();
    const newDayId = Days.insert(newDay);

    Meals.find({ dayId }).forEach((meal) => {
      const newMeal = JSON.parse(JSON.stringify(meal));
      newMeal._id = Random.id();
      newMeal.dayId = newDayId;
      const newMealId = Meals.insert(newMeal);

      MealFoods.find({ dayId, mealId: meal._id }).forEach((mealFood) => {
        const newMealFood = JSON.parse(JSON.stringify(mealFood));
        newMealFood._id = Random.id();
        newMealFood.dayId = newDayId;
        newMealFood.mealId = newMealId;
        MealFoods.insert(newMealFood);
      });
    });
  },
});
