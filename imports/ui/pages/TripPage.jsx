import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { RIENumber, RIEInput } from 'riek';

import Day from '../components/Day.jsx';

import AccountsUIWrapper from '../components/AccountsUIWrapper.jsx';

import { totals } from '../helpers.js';

export default class TripPage extends Component {
  constructor(props) {
    super(props);
    this.handleAddDay = this.handleAddDay.bind(this);
    this.updateTrip = this.updateTrip.bind(this);
    this.updateTripName = this.updateTripName.bind(this);
    this.tripTotals = totals(this.props.mealFoods);
  }

  componentWillUpdate(nextProps) {
    this.tripTotals = totals(nextProps.mealFoods);
  }

  handleAddDay() {
    Meteor.call('days.insert', this.props.trip._id);
  }

  updateTrip(obj) {
    let target;
    let value;
    switch (Object.keys(obj)[0]) {
      case 'calsPerDay':
        target = 'calsPerDay';
        value = Number(obj.calsPerDay);
        break;
      case 'proteinPerDay':
        target = 'proteinPerDay';
        value = Number(obj.proteinPerDay);
        break;
      default:
        return;
    }
    Meteor.call('trips.updateTarget',
      this.props.trip._id,
      target,
      Number(value));
  }

  updateTripName(obj) {
    Meteor.call('trips.updateName',
    this.props.trip._id,
    obj.value);
  }

  renderDays() {
    let weightLeft = this.tripTotals.weight;
    return this.props.days.map((day, idx) => {
      const meals = this.props.meals.filter(
        (meal) => (meal.dayId === day._id));
      const mealFoods = this.props.mealFoods.filter(
        (mealFood) => (mealFood.dayId === day._id));
      const foods = mealFoods.map(
        (mealFood) => (this.props.foods.filter(
          (food) => (food._id === mealFood.foodId))[0]));
      const dayTotals = totals(mealFoods);
      const newDay = (
        <Day
          key={day._id}
          day={day}
          meals={meals}
          mealFoods={mealFoods}
          foods={foods}
          dayTotals={dayTotals}
          weightLeft={weightLeft}
          idx={idx + 1}
        />
      );
      weightLeft -= dayTotals.weight;
      return newDay;
    });
  }

  render() {
    const { trip, days } = this.props;
    const numDays = days.length;
    return (
      <div className="container">
        <header>
          <h1><RIEInput
            value={this.props.trip.name}
            propName="value"
            change={this.updateTripName}
            validate={(name) => (name.length > 0)}
          /> </h1>
        </header>

        <AccountsUIWrapper />
        <div>
          <span>{this.tripTotals.calories} calories</span>
          <span>Number of days: {numDays}</span>

          <span>Target <RIENumber
            value={trip.calsPerDay || 0}
            propName="calsPerDay"
            change={this.updateTrip}
          /> calories per day</span>

          <span>Target <RIENumber
            value={trip.proteinPerDay || 0}
            propName="proteinPerDay"
            change={this.updateTrip}
          /> g protein per day</span>

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
