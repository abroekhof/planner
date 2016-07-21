import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { Foods } from '../api/foods.js';

import Day from './Day.jsx';
import Food from './Food.jsx';

class App extends Component {
  getAppState() {
    return {
      caloriesPerDay: 3000,
      foods: {
        1: { name: 'Clif Bar', calories: 255, weight: 2.4, protein: 10 },
        2: { name: 'ProBar', calories: 290, weight: 3, protein: 9 },
        3: { name: 'Oil', calories: 190, weight: 1, protein: 0 },
      },
      dayList: [1],
      days: {
        1: { meals: [1, 2, 3, 4] },
      },
      meals: {
        1: { type: 'Snacks', foods: [1, 2] },
        2: { type: 'Lunch', foods: [] },
        3: { type: 'Breakfast', foods: [] },
        4: { type: 'Dinner', foods: [] },
      },
      mealFoods: {
        1: { id: 1, qty: 1 },
        2: { id: 2, qty: 2 },
      },
    };
  }

  renderDays() {
    const appState = this.getAppState();
    return appState.dayList.map((day) => (
      <Day key={day} day={day} appState={appState} />
    ));
  }

  renderFoods() {
    return this.props.foods.map((food) => (
      <Food key={food._id} food={food} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Meal Planner</h1>
        </header>
        <div>
          {this.renderFoods()}
        </div>
        <ul>
          {this.renderDays()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  foods: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    foods: Foods.find({}).fetch(),
  };
}, App);
