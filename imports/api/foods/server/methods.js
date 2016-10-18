import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { _ } from 'meteor/underscore';

import Foods from '../foods';
import MealFoods from '../../mealFoods/mealFoods';

const verifyFood = (
  userId,
  foodId,
  name,
  servingsPerContainer,
  calories,
  caloriesFromFat,
  totalFat,
  saturatedFat,
  cholesterol,
  sodium,
  potassium,
  totalCarbohydrate,
  dietaryFiber,
  sugars,
  protein,
  weight
) => {
  const foodObj = {
    name,
    servingsPerContainer,
    calories,
    caloriesPerWeight: calories / weight,
    caloriesFromFat,
    totalFat,
    saturatedFat,
    cholesterol,
    sodium,
    potassium,
    totalCarbohydrate,
    dietaryFiber,
    sugars,
    protein,
    proteinPerWeight: protein / weight,
    weight,
  };
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
    // A food update was requested
    Foods.update(foodId, { $set: foodObj });
  } else {
    // No update, so insert a new food and assign to the user
    foodIdCopy = Foods.insert(_.extend(foodObj, { userId }));
  }
  const percent = 0.02;
  const upper = (1 + percent);
  const lower = (1 - percent);
  const foundFood = Foods.findOne(
    {
      $and: [
        { $text: { $search: name } },
        { servingsPerContainer: { $eq: servingsPerContainer } },
        { calories: { $lte: calories * upper } },
        { calories: { $gte: calories * lower } },
        { caloriesFromFat: { $lte: caloriesFromFat * upper } },
        { caloriesFromFat: { $gte: caloriesFromFat * lower } },
        { totalFat: { $lte: totalFat * upper } },
        { totalFat: { $gte: totalFat * lower } },
        { saturatedFat: { $lte: saturatedFat * upper } },
        { saturatedFat: { $gte: saturatedFat * lower } },
        { cholesterol: { $lte: cholesterol * upper } },
        { cholesterol: { $gte: cholesterol * lower } },
        { sodium: { $lte: sodium * upper } },
        { sodium: { $gte: sodium * lower } },
        { potassium: { $lte: potassium * upper } },
        { potassium: { $gte: potassium * lower } },
        { totalCarbohydrate: { $lte: totalCarbohydrate * upper } },
        { totalCarbohydrate: { $gte: totalCarbohydrate * lower } },
        { dietaryFiber: { $lte: dietaryFiber * upper } },
        { dietaryFiber: { $gte: dietaryFiber * lower } },
        { sugars: { $lte: sugars * upper } },
        { sugars: { $gte: sugars * lower } },
        { protein: { $lte: protein * upper } },
        { protein: { $gte: protein * lower } },
        { weight: { $lte: weight * upper } },
        { weight: { $gte: weight * lower } },
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
    // food was found, and it doesn't belong to the user, update it to make sure it's verified
    if (foundFood.userId !== userId) {
      Foods.update(foundFood._id, { $set: { verified: true } });
    }
    if (foodId) {
      // an update was requested which verified a food, so change any previous MealFoods to use
      // the new food, and delete the old food
      MealFoods.update(
        { foodId },
        { $set: {
          foodId: foundFood._id,
          name: foundFood.name,
          servingsPerContainer: foundFood.servingsPerContainer,
          calories: foundFood.calories,
          caloriesPerWeight: foundFood.caloriesPerWeight,
          caloriesFromFat: foundFood.caloriesFromFat,
          totalFat: foundFood.totalFat,
          saturatedFat: foundFood.saturatedFat,
          cholesterol: foundFood.cholesterol,
          sodium: foundFood.sodium,
          potassium: foundFood.potassium,
          totalCarbohydrate: foundFood.totalCarbohydrate,
          dietaryFiber: foundFood.dietaryFiber,
          sugars: foundFood.sugars,
          protein: foundFood.protein,
          proteinPerWeight: foundFood.proteinPerWeight,
          weight: foundFood.weight,
        },
      });
    }
    // set the old food or the newly created food to be a duplicate
    Foods.update(foodIdCopy, { $set: { duplicateOf: foundFood._id } });
    return foundFood;
  }
  // no closely matching food was found
  if (foodId) {
    // Update was requested, so update all mealFoods
    MealFoods.update(
      { foodId },
      { $set: foodObj,
    });
  }
  return Foods.findOne(foodIdCopy);
};

Meteor.methods({
  'foods.verify': function foodsVerify(
    foodId,
    name,
    servingsPerContainer,
    calories,
    caloriesFromFat,
    totalFat,
    saturatedFat,
    cholesterol,
    sodium,
    potassium,
    totalCarbohydrate,
    dietaryFiber,
    sugars,
    protein,
    weight
  ) {
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
    return verifyFood(
      userId,
      foodId,
      name,
      servingsPerContainer,
      calories,
      caloriesFromFat,
      totalFat,
      saturatedFat,
      cholesterol,
      sodium,
      potassium,
      totalCarbohydrate,
      dietaryFiber,
      sugars,
      protein,
      weight
    );
  },
});

export default verifyFood;
