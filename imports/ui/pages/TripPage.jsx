import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Paper from 'material-ui/Paper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import Day from '../components/Day.jsx';
import TripDetails from '../components/TripDetails.jsx';

import { totals } from '../helpers.js';

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
    const copy = Object.assign({}, this.state);
    copy.open = true;
    this.setState(copy);
  }

  handleClose() {
    const copy = Object.assign({}, this.state);
    copy.open = false;
    this.setState(copy);
  }

  handleTextFieldChange(e) {
    const copy = Object.assign({}, this.state);
    copy.tripName = e.target.value;
    this.setState(copy);
  }

  updateTripName() {
    if (this.state.tripName !== '') {
      Meteor.call('trips.updateName',
      this.props.trip._id,
      this.state.tripName);
    } else {
      const copy = Object.assign({}, this.state);
      copy.tripName = this.props.trip.name;
      this.setState(copy);
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
          idx={dayIdx + 1}
          handleOpenDrawer={this.props.handleOpenDrawer}
        />
      );
      days.unshift(newDay);
    }
    return days;
  }

  render() {
    const { trip, days } = this.props;
    const numDays = days.length;
    const actions = [
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        onTouchTap={this.updateTripName}
      />,
    ];
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
                <MenuItem onClick={this.handleOpen} primaryText="Rename trip" />
                <MenuItem onClick={this.removeTrip} primaryText="Delete this trip" />
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>
        </Paper>

        <Dialog
          title="Rename trip"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="New name"
            onChange={this.handleTextFieldChange}
          />
        </Dialog>

        <TripDetails
          calsPerDay={trip.calsPerDay}
          proteinPerDay={trip.proteinPerDay}
          tripId={trip._id}
          numDays={numDays}
        />

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
  handleOpenDrawer: PropTypes.func.isRequired,
};
