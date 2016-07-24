import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

import { Foods } from '../api/foods.js';
import { Days } from '../api/days.js';

import Day from './Day.jsx';
import Food from './Food.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddDay = this.handleAddDay.bind(this);
  }

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

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const name = ReactDOM.findDOMNode(this.refs.foodName).value.trim();
    const calories = ReactDOM.findDOMNode(this.refs.calories).value.trim();
    const protein = ReactDOM.findDOMNode(this.refs.protein).value.trim();
    const weight = ReactDOM.findDOMNode(this.refs.weight).value.trim();

    Meteor.call('foods.insert',
      name,
      Number(calories),
      Number(protein),
      Number(weight));

    // Clear form
    ReactDOM.findDOMNode(this.refs.foodName).value = '';
    ReactDOM.findDOMNode(this.refs.calories).value = '';
    ReactDOM.findDOMNode(this.refs.protein).value = '';
    ReactDOM.findDOMNode(this.refs.weight).value = '';
  }

  handleAddDay() {
    Meteor.call('days.insert');
  }

  renderDays() {
    const appState = this.getAppState();
    return this.props.days.map((day, idx) => (
      <Day key={day._id} day={day} idx={idx + 1} appState={appState} />
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
          <form className="new-food" onSubmit={this.handleSubmit} >
            <input
              type="text"
              ref="foodName"
              autoComplete="off"
              placeholder="Food name"
            />
            <input
              type="text"
              ref="calories"
              autoComplete="off"
              placeholder="Number of calories"
            />
            <input
              type="text"
              ref="protein"
              autoComplete="off"
              placeholder="Protein in grams"
            />
            <input
              type="text"
              ref="weight"
              autoComplete="off"
              placeholder="Weight in ounces"
            />
            <input
              type="submit"
            />
          </form>
        </header>
        <div>
          {this.renderFoods()}
        </div>
        <div>
          <button onClick={this.handleAddDay}>Add day</button>
          {this.renderDays()}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  foods: PropTypes.array.isRequired,
  days: PropTypes.array.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('days');
  Meteor.subscribe('foods');
  return {
    foods: Foods.find({}).fetch(),
    days: Days.find({}).fetch(),
  };
}, App);
