import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import MealFoods from './mealFoods';
import Foods from '../foods/foods';

Meteor.methods({
  'mealFoods.insert': function mealFoodsInsert(foodId, tripId, mealId, dayId, qty) {
    check(tripId, String);
    check(foodId, String);
    check(mealId, Number);
    check(dayId, String);
    check(qty, Number);
    const food = Foods.findOne(foodId);
    MealFoods.upsert(
      {
        tripId,
        foodId,
        mealId,
        dayId,
        userId: this.userId,
        name: food.name,
        servingsPerContainer: food.servingsPerContainer,
        calories: food.calories,
        caloriesPerWeight: food.caloriesPerWeight,
        caloriesFromFat: food.caloriesFromFat,
        totalFat: food.totalFat,
        saturatedFat: food.saturatedFat,
        cholesterol: food.cholesterol,
        sodium: food.sodium,
        potassium: food.potassium,
        totalCarbohydrate: food.totalCarbohydrate,
        dietaryFiber: food.dietaryFiber,
        sugars: food.sugars,
        protein: food.protein,
        proteinPerWeight: food.proteinPerWeight,
        weight: food.weight,
      },
      { $inc: { qty } },
    );
  },
  'mealFoods.remove': function mealFoodsRemove(mealFoodId) {
    check(mealFoodId, String);
    MealFoods.remove(mealFoodId);
  },
  'mealFoods.updateQty': function mealFoodsUpdateQty(mealFoodId, qty) {
    check(mealFoodId, String);
    check(qty, Number);
    MealFoods.update(
      mealFoodId,
      { $set: { qty } }
    );
  },
});
