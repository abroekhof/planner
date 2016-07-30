export const totals = (mealFoods) => (

   mealFoods.reduce(
    (prevTotal, mealFood) => (
      {
        calories: prevTotal.calories + mealFood.food.calories * mealFood.qty,
        protein: prevTotal.protein + mealFood.food.protein * mealFood.qty,
        weight: prevTotal.weight + mealFood.food.weight * mealFood.qty,
      }
    ),
     {
       calories: 0,
       protein: 0,
       weight: 0,
     }
   )
 );
