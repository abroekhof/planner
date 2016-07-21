import React, { PropTypes } from 'react';
import MealFood from './MealFood.jsx';

const Meal = (props) => {
  const appState = props.appState;
  const meal = appState.meals[props.meal];
  const newTotalCals = meal.foods.reduce((food1, food2) =>
  food1 + appState.foods[appState.mealFoods[food2].id].calories *
  appState.mealFoods[food2].qty,
  0);

  return (
    <div>
      <span>{meal.type}</span>
      {meal.foods.map((mealFood) =>
        <MealFood
          key={mealFood}
          mealFood={mealFood}
          foods={appState.foods}
          mealFoods={appState.mealFoods}
          meal={props.meal}
        />
      )}

      <span>{newTotalCals} calories</span>
    </div>
	);
};

Meal.propTypes = {
  meal: PropTypes.number.isRequired,
  appState: PropTypes.object.isRequired,
};

export default Meal;
