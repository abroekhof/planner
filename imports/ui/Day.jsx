import React, { PropTypes, Component } from 'react';
import Meal from './Meal.jsx';

import { Meteor } from 'meteor/meteor';

class Day extends Component {
  constructor(props) {
    super(props);
    this.handleRemoveDay = this.handleRemoveDay.bind(this);
  }

  handleRemoveDay() {
    Meteor.call('days.remove', this.props.day._id);
  }
  // const appState = props.appState;
  // const totalCals = appState.days[props.day].meals.reduce((meal1, meal2) =>
  // meal1 + appState.meals[meal2].foods.reduce((food1, food2) =>
  // food1 + appState.foods[appState.mealFoods[food2].id].calories *
  // appState.mealFoods[food2].qty, 0),
  // 0);
  // const totalProtein = appState.days[props.day].meals.reduce((meal1, meal2) =>
  // meal1 + appState.meals[meal2].foods.reduce((food1, food2) =>
  // food1 + appState.foods[appState.mealFoods[food2].id].protein *
  // appState.mealFoods[food2].qty, 0),
  // 0);

  render() {
    const meals = this.props.meals;
    return (
      <div>
        <h2>Day {this.props.idx}</h2>
        <button onClick={this.handleRemoveDay}>Remove day</button>
        <ul>
        {meals.map((meal) => {
          const mealFoods = this.props.mealFoods.filter((mealFood) =>
          (mealFood.mealId === meal._id));
          return (
            <Meal
              key={meal._id}
              meal={meal}
              mealFoods={mealFoods}
              dayId={this.props.day._id}
            />
          );
        })}
        </ul>

      {/* <ul>
        <li>{totalCals} calories</li>
        <li>{totalProtein} g protein</li>
      </ul> */}
      </div>
  );
  }
}

Day.propTypes = {
  day: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  meals: PropTypes.array.isRequired,
  mealFoods: PropTypes.array.isRequired,
};

export default Day;
