import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import MealFoods from '../mealFoods/mealFoods';

class DaysCollection extends Mongo.Collection {
  remove(selector, callback) {
    // also remove all child mealFoods
    MealFoods.remove({ dayId: selector });
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
    optional: false,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
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
  Meteor.publish('days.inTrip', (tripId) => {
    check(tripId, String);
    return Days.find({ tripId });
  });
}

Meteor.methods({
  'days.insert': function daysInsert(tripId) {
    check(tripId, String);
    return Days.insert({
      tripId,
      userId: this.userId,
    });
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

    MealFoods.find({ dayId }).forEach((mealFood) => {
      const newMealFood = JSON.parse(JSON.stringify(mealFood));
      newMealFood._id = Random.id();
      newMealFood.dayId = newDayId;
      newMealFood.mealId = mealFood.mealId;
      MealFoods.insert(newMealFood);
    });
  },
});
