import { Meteor } from 'meteor/meteor';

import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

// import MealFood from './MealFood.jsx';

const mealTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    Meteor.call('mealFoods.insert', item.food._id, props.meal._id, props.dayId, 1);
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

const Meal = (props) => {
  // const appState = props.appState;
  // const meal = appState.meals[props.meal];
  // const newTotalCals = meal.foods.reduce((food1, food2) =>
  // food1 + appState.foods[appState.mealFoods[food2].id].calories *
  // appState.mealFoods[food2].qty,
  // 0);
  const { connectDropTarget } = props;
  return connectDropTarget(
    <div>
      <span>{props.meal.name}</span>
      <ul>
      {props.mealFoods.map((mealFood) => (
        <li key={mealFood._id}>{mealFood._id}</li>
      ))}
      </ul>

      {/* <span>{newTotalCals} calories</span> */}
    </div>
	);
};

Meal.propTypes = {
  meal: PropTypes.object.isRequired,
  dayId: PropTypes.string.isRequired,
  mealFoods: PropTypes.array.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

export default DropTarget('food', mealTarget, collect)(Meal);
