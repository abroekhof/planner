import React, { PropTypes } from 'react';

const MealFood = (props) => {
  const mealFoods = props.mealFoods;
  const foods = props.foods;
  const mealFoodId = props.mealFood;
  const qty = mealFoods[mealFoodId].qty;
  const food = foods[mealFoods[mealFoodId].id];
  return (
    <div>
      <span>{qty} {food.food} {food.calories * qty} {food.protein * qty}</span>
    </div>
  );
};

MealFood.propTypes = {
  mealFoods: PropTypes.object.isRequired,
  meal: PropTypes.number.isRequired,
  foods: PropTypes.object.isRequired,
  mealFood: PropTypes.number.isRequired,
};

export default MealFood;
