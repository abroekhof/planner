import React, { PropTypes, Component } from 'react';
import Meal from './Meal.jsx';

import { Meteor } from 'meteor/meteor';

import { totals } from './helpers.js';

class Day extends Component {
  constructor(props) {
    super(props);
    this.handleRemoveDay = this.handleRemoveDay.bind(this);
  }

  handleRemoveDay() {
    Meteor.call('days.remove', this.props.day._id);
  }

  renderMeals() {
    return this.props.meals.map((meal) => {
      const mealFoods = this.props.mealFoods.filter(
        (mealFood) => (mealFood.mealId === meal._id));
      const foods = mealFoods.map(
        (mealFood) => (this.props.foods.filter(
          (food) => (food._id === mealFood.foodId))[0]));
      return (
        <Meal
          key={meal._id}
          meal={meal}
          mealFoods={mealFoods}
          foods={foods}
          dayId={this.props.day._id}
        />
      );
    });
  }

  render() {
    const dayTotals = totals(this.props.mealFoods);
    return (
      <div>
        <h2>Day {this.props.idx}</h2>
        <button onClick={this.handleRemoveDay}>Remove day</button>
        <span>{dayTotals.calories}</span>
        <ul>
        {this.renderMeals()}
        </ul>
      </div>
  );
  }
}

Day.propTypes = {
  day: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  meals: PropTypes.array.isRequired,
  mealFoods: PropTypes.array.isRequired,
  foods: PropTypes.array.isRequired,
};

export default Day;
