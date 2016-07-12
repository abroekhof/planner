import React, {Component, PropTypes} from 'react';
import MealFood from './MealFood.jsx';

class Meal extends Component {
 render() {
    const appState = this.props.appState;
    const meal = appState.meals[this.props.meal];
    const newTotalCals = meal.foods.reduce((food1, food2) =>
    food1 + appState.foods[appState.mealFoods[food2].id].calories *
    appState.mealFoods[food2].qty,
    0);

		return (
      <div>
        {meal.type}
        {meal.foods.map((mealFood) =>
          <MealFood
            key={mealFood}
            mealFood={mealFood}
            foods={appState.foods}
            mealFoods={appState.mealFoods}
            meal={this.props.meal}/>
        )}

          {newTotalCals} calories
      </div>
		);
	}
}

Meal.propTypes = {
  meal: PropTypes.number.isRequired,
  appState: PropTypes.object.isRequired,
};

export default Meal;
