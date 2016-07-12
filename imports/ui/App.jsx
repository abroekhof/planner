import React, { Component } from 'react';

import Day from './Day.jsx';

export default class App extends Component {
  getAppState() {
    return {
      caloriesPerDay: 3000,
      foods: {
        1: {food: 'Clif Bar', calories: 255, weight: 2.4, protein: 10},
        2: {food: 'ProBar', calories: 290, weight: 3, protein: 9},
        3: {food: 'Oil', calories: 190, weight: 1, protein: 0}
      },
      dayList: [1],
      days: {
        1: {meals: [1, 2, 3, 4]}
      },
      meals: {
        1: {type: "Snacks", foods: [1, 2]},
        2: {type: "Lunch", foods: []},
        3: {type: "Breakfast", foods: []},
        4: {type: "Dinner", foods: []}
      },
      mealFoods: {
        1: {id: 1, qty: 1},
        2: {id: 2, qty: 2}
      }
    };
  }

  renderDays() {
    const appState = this.getAppState();
    return appState.dayList.map((day) => (
      <Day key={day} day={day} appState={appState} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Meal Planner</h1>
        </header>

        <ul>
          {this.renderDays()}
        </ul>
      </div>
    );
  }
}
