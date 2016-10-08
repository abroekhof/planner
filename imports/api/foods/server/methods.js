import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import Foods from '../foods';
import MealFoods from '../../mealFoods/mealFoods';

const verifyFood = (userId, foodId, name, calories, protein, weight) => {
  let foodIdCopy = foodId;
  if (foodId) {
    const food = Foods.findOne(foodId);
    if (!food) {
      throw new Meteor.Error('foods.verify',
        'No food found to update');
    }
    if (userId !== food.userId) {
      throw new Meteor.Error('foods.verify.accessDenied',
        'Cannot update a food that does not belong to you');
    }
    if (food.verified) {
      throw new Meteor.Error('foods.verify.accessDenied',
        'Cannot update a food that has been verified');
    }
    // a food update was requested
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
  } else {
    foodIdCopy = Foods.insert({
      userId,
      name,
      calories,
      caloriesPerWeight: calories / weight,
      protein,
      proteinPerWeight: protein / weight,
      weight,
    });
  }
  const percent = 0.02;
  const upper = (1 + percent);
  const lower = (1 - percent);
  const foundFood = Foods.findOne(
    {
      $and: [
        { $text: { $search: name } },
        { calories: { $lte: calories * upper } },
        { calories: { $gte: calories * lower } },
        { protein: { $lte: protein * upper } },
        { protein: { $gte: protein * lower } },
        { weight: { $lte: weight * upper } },
        { weight: { $gte: weight * lower } },
        { userId: { $ne: userId } },
      ],
    },
    { fields: { score: { $meta: 'textScore' } },
    sort: { score: { $meta: 'textScore' } },
    }
  );
  let foodsMatch = false;
  if (foundFood) {
    // match was found, make sure that it's a close match
    const foundToks = foundFood.name.toLowerCase().split(/\b\s+/);
    const searchToks = name.toLowerCase().split(/\b\s+/);
    const minLength = Math.min(foundToks.length, searchToks.length);
    foodsMatch = (minLength === _.intersection(foundToks, searchToks).length);
  }
  if (foodsMatch) {
    // food was found, update it to make sure it's verified
    Foods.update(foundFood._id, { $set: { verified: true } });
    if (foodId) {
      // an update was requested which verified a food, so change any previous MealFoods to use
      // the new food, and delete the old food
      MealFoods.update(
        { foodId },
        { $set: {
          foodId: foundFood._id,
          name: foundFood.name,
          calories: foundFood.calories,
          caloriesPerWeight: foundFood.caloriesPerWeight,
          protein: foundFood.protein,
          proteinPerWeight: foundFood.proteinPerWeight,
          weight: foundFood.weight,
        },
      });
    }
    // set the old food or the newly created food to be a duplicate
    Foods.update(foodIdCopy, { $set: { duplicateOf: foundFood._id } });
    return foundFood._id;
  }
  // no closely matching food was found
  if (foodId) {
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
  }
  return foodIdCopy;
};

Meteor.methods({
  'foods.verify': function foodsVerify(foodId, name, calories, protein, weight) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error('foods.verify.accessDenied',
        'Cannot create a food when not logged in');
    }
    check(foodId, Match.Maybe(String));
    check(name, String);
    check(calories, Number);
    check(protein, Number);
    check(weight, Number);
    return verifyFood(userId, foodId, name, calories, protein, weight);
  },
});

export default verifyFood;
