import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import Day from '../components/Day.jsx';
import TripDetails from '../components/TripDetails.jsx';

import totals from '../helpers.js';

export default class TripPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      tripName: props.trip.name,
    };
    this.handleAddDay = this.handleAddDay.bind(this);
    this.updateTripName = this.updateTripName.bind(this);
    this.removeTrip = this.removeTrip.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.tripTotals = totals(this.props.mealFoods);
  }

  componentWillUpdate(nextProps) {
    this.tripTotals = totals(nextProps.mealFoods);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleTextFieldChange(e) {
    this.setState({ tripName: e.target.value });
  }

  updateTripName() {
    if (this.state.tripName !== '') {
      Meteor.call('trips.updateName',
      this.props.trip._id,
      this.state.tripName);
    } else {
      this.setState({ tripName: this.props.trip.name });
    }
    this.handleClose();
  }

  removeTrip() {
    this.props.removeTrip(this.props.trip._id);
  }

  handleAddDay() {
    Meteor.call('days.insert', this.props.trip._id);
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

      // catch the resupply at the end of the day
      if (dayMeals.length === day.resupply) {
        resupplyWeight = currWeight;
        currWeight = 0;
      }
      // go backwards through the meals
      for (let mealIdx = dayMeals.length - 1; mealIdx >= 0; mealIdx--) {
        const meal = dayMeals[mealIdx];
        const dayMealFoods = mealFoods.filter(
          (mealFood) => (mealFood.mealId === meal._id));

        for (let dayMealFoodIdx = dayMealFoods.length - 1; dayMealFoodIdx >= 0; dayMealFoodIdx--) {
          const dayMealFood = dayMealFoods[dayMealFoodIdx];
          currWeight += dayMealFood.qty * dayMealFood.weight;
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
          dayTotals={dayTotals}
          weightLeft={currWeight}
          resupplyWeight={resupplyWeight}
          calsPerDay={this.props.trip.calsPerDay}
          proteinPerDay={this.props.trip.proteinPerDay}
          idx={dayIdx}
          handleOpenFoodDrawer={this.props.handleOpenFoodDrawer}
        />
      );
      days.unshift(newDay);
    }
    return days;
  }

  render() {
    const { trip, days, loading } = this.props;
    const numDays = days.length;
    const actions = [
      <FlatButton
        label="Ok"
        primary
        onTouchTap={this.updateTripName}
      />,
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
    ];
    if (loading) {
      return (
        <div>loading</div>
      );
    }
    return (
      <div className="container">

        <Dialog
          title="Rename trip"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="New name"
            keyboardFocused
            onChange={this.handleTextFieldChange}
          />
        </Dialog>

        <TripDetails
          calsPerDay={trip.calsPerDay}
          proteinPerDay={trip.proteinPerDay}
          tripId={trip._id}
          numDays={numDays}
          tripName={trip.name}
          openNameDialog={this.handleOpen}
          removeTrip={this.removeTrip}
        />

        {this.renderDays()}

        <FloatingActionButton
          onClick={this.handleAddDay}
          style={{
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
          }}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

TripPage.propTypes = {
  trip: PropTypes.object,
  foods: PropTypes.array.isRequired,
  days: PropTypes.array.isRequired,
  meals: PropTypes.array.isRequired,
  mealFoods: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
  removeTrip: PropTypes.func.isRequired,
  handleOpenFoodDrawer: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
