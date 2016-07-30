import { Meteor } from 'meteor/meteor';

import React, { PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

import MealFood from './MealFood.jsx';

import { totals } from './helpers.js';

const mealTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    Meteor.call('mealFoods.insert', item.food._id, props.meal._id, props.dayId, 1);
  },
};

function collect(connect) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

const Meal = (props) => {
  const { connectDropTarget } = props;
  const mealTotals = totals(props.mealFoods);
  return connectDropTarget(
    <div>
      <span>{props.meal.name} ({mealTotals.calories} calories)</span>
      <ul>
      {props.mealFoods.map((mealFood) => {
        const f = props.foods.filter((food) => (food._id === mealFood.foodId))[0];
        return (
          <MealFood key={mealFood._id} mealFood={mealFood} food={f} />

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
