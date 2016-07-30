import { Meteor } from 'meteor/meteor';

import React, { PropTypes, Component } from 'react';
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

class Meal extends Component {

  renderMealFoods() {
    return this.props.mealFoods.map((mealFood) => {
      const f = this.props.foods.filter((food) => (food._id === mealFood.foodId))[0];
      return (
        <MealFood key={mealFood._id} mealFood={mealFood} food={f} />
      );
    });
  }

  render() {
    const { connectDropTarget } = this.props;
    const mealTotals = totals(this.props.mealFoods);
    return connectDropTarget(
      <div>
        <span>{this.props.meal.name} ({mealTotals.calories} calories)</span>
        <ul>
        {this.renderMealFoods()}
        </ul>
      </div>
    );
  }
}

Meal.propTypes = {
  meal: PropTypes.object.isRequired,
  dayId: PropTypes.string.isRequired,
  mealFoods: PropTypes.array.isRequired,
  foods: PropTypes.array.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

export default DropTarget('food', mealTarget, collect)(Meal);
