import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Card, CardText, CardTitle } from 'material-ui/Card';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import Day from '../components/Day.jsx';

import { totals } from '../helpers.js';

export default class TripPage extends Component {
  constructor(props) {
    super(props);
    this.handleAddDay = this.handleAddDay.bind(this);
    this.updateCalories = this.updateCalories.bind(this);
    this.updateProtein = this.updateProtein.bind(this);
    this.updateTripName = this.updateTripName.bind(this);
    this.removeTrip = this.removeTrip.bind(this);
    this.tripTotals = totals(this.props.mealFoods);
  }

  componentWillUpdate(nextProps) {
    this.tripTotals = totals(nextProps.mealFoods);
  }

  removeTrip() {
    this.props.removeTrip(this.props.trip._id);
  }

  handleAddDay() {
    Meteor.call('days.insert', this.props.trip._id);
  }

  updateCalories(e, value) {
    Meteor.call('trips.updateTarget',
      this.props.trip._id,
      'calsPerDay',
      value);
  }

  updateProtein(e, value) {
    Meteor.call('trips.updateTarget',
      this.props.trip._id,
      'proteinPerDay',
      value);
  }

  updateTripName(obj) {
    Meteor.call('trips.updateName',
    this.props.trip._id,
    obj.value);
  }

  renderDays() {
    let currWeight = 0;
    let resupplyWeight = 0;

    const days = [];

    // go backwards through the days
    for (let dayIdx = this.props.days.length - 1; dayIdx >= 0; dayIdx--) {
      const day = this.props.days[dayIdx];
      const dayMeals = this.props.meals.filter((meal) => (meal.dayId === day._id));
      const mealFoods = this.props.mealFoods.filter((mealFood) => (mealFood.dayId === day._id));
      const dayTotals = totals(mealFoods);

      const foods = mealFoods.map(
        (mealFood) => (this.props.foods.filter(
          (food) => (food._id === mealFood.foodId))[0]));

      // go backwards through the meals
      for (let mealIdx = dayMeals.length - 1; mealIdx >= 0; mealIdx--) {
        const meal = dayMeals[mealIdx];
        const dayMealFoods = mealFoods.filter(
          (mealFood) => (mealFood.mealId === meal._id));

        for (let dayMealFoodIdx = dayMealFoods.length - 1; dayMealFoodIdx >= 0; dayMealFoodIdx--) {
          const dayMealFood = dayMealFoods[dayMealFoodIdx];
          currWeight += dayMealFood.qty * dayMealFood.food.weight;
        }
        // if we come across a resupply, reset the weight!
        if (mealIdx === day.resupply) {
          resupplyWeight = currWeight;
          currWeight = 0;
        }
      }
      const newDay = (
        <Day
          key={day._id}
          day={day}
          meals={dayMeals}
          mealFoods={mealFoods}
          foods={foods}
          dayTotals={dayTotals}
          weightLeft={currWeight}
          resupplyWeight={resupplyWeight}
          idx={dayIdx + 1}
        />
      );
      days.unshift(newDay);
    }
    return days;
  }

  render() {
    const { trip, days } = this.props;
    const numDays = days.length;
    return (
      <div className="container">
        <Paper>
          <Toolbar>
            <ToolbarGroup>
              <ToolbarTitle text={trip.name} />
            </ToolbarGroup>
            <ToolbarGroup lastChild>
              <IconMenu
                iconButtonElement={
                  <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem onClick={this.removeTrip} primaryText="Delete this trip" />
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>
        </Paper>
        <Card>
          <CardTitle
            title="Trip details"
            subtitle={`${numDays} days`}
          />
          <CardText>
            <Slider
              description={`${trip.calsPerDay} calories per day`}
              defaultValue={3000}
              min={0}
              max={5000}
              step="25"
              value={trip.calsPerDay}
              onChange={this.updateCalories}
              sliderStyle={{ marginTop: 12, marginBottom: 24 }}
            />
            <Slider
              description={`${trip.proteinPerDay} g protein per day`}
              defaultValue={100}
              min={0}
              max={200}
              step="5.0"
              value={trip.proteinPerDay}
              onChange={this.updateProtein}
              sliderStyle={{ marginTop: 12, marginBottom: 24 }}
            />
          </CardText>
        </Card>

        {this.renderDays()}

        <FloatingActionButton onClick={this.handleAddDay} style={{ marginLeft: 20 }}>
          <ContentAdd />
        </FloatingActionButton>
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
  removeTrip: PropTypes.function,
};
