import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Foods from './foods.js';
import MealFoods from '../mealFoods/mealFoods.js';

Meteor.methods({
  'foods.insert': function foodsInsert(name, calories, protein, weight) {
    if (!this.userId) {
      throw new Meteor.Error('foods.insert.accessDenied',
        'Cannot create a food when not logged in');
    }
    check(name, String);
    check(calories, Number);
    check(protein, Number);
    check(weight, Number);

    return Foods.insert({
      userId: this.userId,
      name,
      calories,
      caloriesPerWeight: calories / weight,
      protein,
      proteinPerWeight: protein / weight,
      weight,
    });
  },
  'foods.update': function foodsUpdate(foodId, name, calories, protein, weight) {
    if (!this.userId) {
      throw new Meteor.Error('foods.insert.accessDenied',
        'Cannot create a food when not logged in');
    }
    const food = Foods.findOne(foodId);
    if (this.userId !== food.userId) {
      throw new Meteor.Error('foods.remove.accessDenied',
        'Cannot update a food that does not belong to you');
    }
    if (food.verified) {
      throw new Meteor.Error('foods.remove.accessDenied',
        'Cannot update a food that has been verified');
    }
    check(foodId, String);
    check(name, String);
    check(calories, Number);
    check(protein, Number);
    check(weight, Number);
    Foods.update(
      foodId,
      { $set: {
        name,
        calories,
        caloriesPerWeight: calories / weight,
        protein,
        proteinPerWeight: protein / weight,
        weight,
      },
    });
    MealFoods.update(
      { foodId },
      { $set: {
        name,
        calories,
        caloriesPerWeight: calories / weight,
        protein,
        proteinPerWeight: protein / weight,
        weight,
      },
    });
  },
  'foods.remove': function foodsRemove(foodId) {
    const food = Foods.findOne(foodId);
    if (this.userId !== food.userId) {
      throw new Meteor.Error('foods.remove.accessDenied',
        'Cannot delete a food that does not belong to you');
    }
    if (food.verified) {
      throw new Meteor.Error('foods.remove.accessDenied',
        'Cannot delete a food that has been verified');
    }
    check(foodId, String);

    Foods.remove(foodId);
    // delete any MealFoods which use this food
    MealFoods.remove({ foodId });
  },
});
