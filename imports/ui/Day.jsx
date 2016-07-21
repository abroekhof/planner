import React, { PropTypes } from 'react';
import Meal from './Meal.jsx';

const Day = (props) => {
  const appState = props.appState;
  const totalCals = appState.days[props.day].meals.reduce((meal1, meal2) =>
  meal1 + appState.meals[meal2].foods.reduce((food1, food2) =>
  food1 + appState.foods[appState.mealFoods[food2].id].calories *
  appState.mealFoods[food2].qty, 0),
  0);
  const totalProtein = appState.days[props.day].meals.reduce((meal1, meal2) =>
  meal1 + appState.meals[meal2].foods.reduce((food1, food2) =>
  food1 + appState.foods[appState.mealFoods[food2].id].protein *
  appState.mealFoods[food2].qty, 0),
  0);

  return (
    <div>
    Day {props.appState.dayList.indexOf(props.day) + 1}
      <button>Remove day</button>

    {props.appState.days[props.day].meals.map((meal) =>
      <Meal key={meal} meal={meal} appState={props.appState} />
    )}

      <ul>
        <li>{totalCals} calories</li>
        <li>{totalProtein} g protein</li>
      </ul>
    </div>
  );
};

Day.propTypes = {
  day: PropTypes.number.isRequired,
  appState: PropTypes.object.isRequired,
};

export default Day;
