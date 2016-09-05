export const totals = (mealFoods) => (
   mealFoods.reduce(
    (prevTotal, mealFood) => (
      {
        calories: prevTotal.calories + (mealFood.calories * mealFood.qty),
        protein: prevTotal.protein + (mealFood.protein * mealFood.qty),
        weight: prevTotal.weight + (mealFood.weight * mealFood.qty),
      }
    ),
     {
       calories: 0,
       protein: 0,
       weight: 0,
     }
   )
 );
