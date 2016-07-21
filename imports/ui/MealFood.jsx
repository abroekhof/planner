import React, { Component, PropTypes } from 'react';

class MealFood extends Component {

  render() {
    const mealFoods = this.props.mealFoods;
    const foods = this.props.foods;
    const mealFoodId = this.props.mealFood;
    const qty = mealFoods[mealFoodId].qty;
    const food = foods[mealFoods[mealFoodId].id];
    return (
      <div>
        <span>{qty} {food.food} {food.calories * qty} {food.protein * qty}</span>
      </div>
    );
  }
}

MealFood.propTypes = {
  mealFoods: PropTypes.object.isRequired,
  meal: PropTypes.number.isRequired,
  foods: PropTypes.object.isRequired,
  mealFood: PropTypes.number.isRequired,
};

export default MealFood;
