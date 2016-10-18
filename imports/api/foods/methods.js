import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Foods from './foods';
import MealFoods from '../mealFoods/mealFoods';

Meteor.methods({
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
