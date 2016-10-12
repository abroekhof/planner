import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Random } from 'meteor/random';

import Days from './days';
import MealFoods from '../mealFoods/mealFoods';

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
