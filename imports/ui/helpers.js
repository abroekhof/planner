export const totalCals = (mealFoods) => (
   mealFoods.reduce(
    (prevTotal, mealFood) => (prevTotal + mealFood.food.calories * mealFood.qty),
    0
  )
);
