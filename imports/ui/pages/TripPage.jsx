import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Day from '../components/Day.jsx';
import Food from '../components/Food.jsx';
import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';

import { totals } from '../helpers.js';

export default class TripPage extends Component {
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
    Meteor.call('days.insert', this.props.trip._id);
  }

  renderDays() {
    return this.props.days.map((day, idx) => {
      const meals = this.props.meals.filter(
        (meal) => (meal.dayId === day._id));
      const mealFoods = this.props.mealFoods.filter(
        (mealFood) => (mealFood.dayId === day._id));
      const foods = mealFoods.map(
        (mealFood) => (this.props.foods.filter(
          (food) => (food._id === mealFood.foodId))[0]));
      return (
        <Day
          key={day._id}
          day={day}
          meals={meals}
          mealFoods={mealFoods}
          foods={foods}
          idx={idx + 1}
        />
    );
    });
  }

  renderFoods() {
    return this.props.foods.map((food) => (
      <Food key={food._id} food={food} />
    ));
  }

  renderForm() {
    return (
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
      </form>);
  }

  render() {
    const tripTotals = totals(this.props.mealFoods);
    return (
      <div className="container">
        <header>
          <h1>Meal Planner</h1>
          {this.renderForm()}
        </header>
        <div>
          {this.renderFoods()}
        </div>
        <AccountsUIWrapper />
        <div>
          <span>{tripTotals.calories} calories</span>
          <button onClick={this.handleAddDay}>Add day</button>
          {this.renderDays()}
        </div>
      </div>
    );
  }
}

TripPage.propTypes = {
  trip: PropTypes.object.isRequired,
  foods: PropTypes.array.isRequired,
  days: PropTypes.array.isRequired,
  meals: PropTypes.array.isRequired,
  mealFoods: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};
