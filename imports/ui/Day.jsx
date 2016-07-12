import React, {Component, PropTypes} from 'react';
import Meal from './Meal.jsx';


class Day extends Component {

  render() {
    const appState = this.props.appState;
    const totalCals = appState.days[this.props.day].meals.reduce((meal1, meal2) =>
    meal1 + appState.meals[meal2].foods.reduce((food1, food2) =>
    food1 + appState.foods[appState.mealFoods[food2].id].calories *
    appState.mealFoods[food2].qty, 0),
    0);
    const totalProtein = appState.days[this.props.day].meals.reduce((meal1, meal2) =>
    meal1 + appState.meals[meal2].foods.reduce((food1, food2) =>
    food1 + appState.foods[appState.mealFoods[food2].id].protein *
    appState.mealFoods[food2].qty, 0),
    0);

    return (
      <div>
      Day {this.props.appState.dayList.indexOf(this.props.day)+1}
      <button label="Remove day"/>

      {this.props.appState.days[this.props.day].meals.map((meal) =>
        <Meal key={meal} meal={meal} appState={this.props.appState} actions={this.props.actions}/>
      )}

      <ul>
      <li>{totalCals} calories</li>
      <li>{totalProtein} g protein</li>
      </ul>
      </div>
    );
  }
}

Day.propTypes = {
  day: PropTypes.number.isRequired,
  appState: PropTypes.object.isRequired,
};

export default Day;
