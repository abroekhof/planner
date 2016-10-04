import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';

import Foods from '../foods.js';
import MealFoods from '../../mealFoods/mealFoods.js';

Meteor.methods({
  'foods.verify': function foodsVerify(foodId, name, calories, protein, weight) {
    if (!this.userId) {
      throw new Meteor.Error('foods.verify.accessDenied',
        'Cannot create a food when not logged in');
    }
    check(foodId, Match.Maybe(String));
    if (foodId) {
      const food = Foods.findOne(foodId);
      if (this.userId !== food.userId) {
        throw new Meteor.Error('foods.remove.accessDenied',
          'Cannot update a food that does not belong to you');
      }
      if (food.verified) {
        throw new Meteor.Error('foods.remove.accessDenied',
          'Cannot update a food that has been verified');
      }
    }
    check(name, String);
    check(calories, Number);
    check(protein, Number);
    check(weight, Number);
    const foundFood = Foods.findOne(
      {
        $and: [
          { $text: { $search: name } },
          { calories: { $lte: calories * 1.05 } },
          { calories: { $gte: calories * 0.95 } },
          { protein: { $lte: protein * 1.05 } },
          { protein: { $gte: protein * 0.95 } },
          { weight: { $lte: weight * 1.05 } },
          { weight: { $gte: weight * 0.95 } },
          { userId: { $ne: this.userId } },
        ],
      },
      { fields: { score: { $meta: 'textScore' } },
      sort: { score: { $meta: 'textScore' } },
      }
    );
    if (foundFood) {
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
        Foods.remove(foodId);
      }
      return foundFood._id;
    }
    // no closely matching food was found
    if (foodId) {
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
      return foodId;
    }
    // no matching food and no update, so just create a new food
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
});
