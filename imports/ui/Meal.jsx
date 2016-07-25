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
  const { connectDropTarget } = props;
  return connectDropTarget(
    <div>
      <span>{props.meal.name}</span>
      <ul>
      {props.mealFoods.map((mealFood) => {
        const f = props.foods.filter((food) => (food._id === mealFood.foodId))[0];
        return (
          <li key={mealFood._id}>{f.name}</li>
        );
      })}
      </ul>
    </div>
	);
};

Meal.propTypes = {
  meal: PropTypes.object.isRequired,
  dayId: PropTypes.string.isRequired,
  mealFoods: PropTypes.array.isRequired,
  foods: PropTypes.array.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

export default DropTarget('food', mealTarget, collect)(Meal);
