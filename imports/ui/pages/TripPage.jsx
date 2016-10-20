import React, { Component, PropTypes } from 'react';

import { Meteor } from 'meteor/meteor';
import { analytics } from 'meteor/okgrow:analytics';

import classNames from 'classnames';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import Day from '../components/Day.jsx';
import TripDetails from '../components/TripDetails.jsx';
import NotFoundPage from './NotFoundPage.jsx';

import { totals } from '../helpers';
import { meals } from '../../api/meals/meals';

export default class TripPage extends Component {
  constructor(props) {
    super(props);
    this.handleAddDay = this.handleAddDay.bind(this);
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
    analytics.track('Added day', { tripId: this.props.trip._id });
    Meteor.call('days.insert', this.props.trip._id);
  }

  renderDays() {
    let currWeight = 0;
    let resupplyWeight = 0;

    const days = [];

    // go backwards through the days
    for (let dayIdx = this.props.days.length - 1; dayIdx >= 0; dayIdx -= 1) {
      const day = this.props.days[dayIdx];
      const mealFoods = this.props.mealFoods.filter(mealFood => (mealFood.dayId === day._id));
      const dayTotals = totals(mealFoods);

      // catch the resupply at the end of the day
      if (meals.length === day.resupply) {
        resupplyWeight = currWeight;
        currWeight = 0;
      }
      // go backwards through the meals
      for (let mealIdx = meals.length - 1; mealIdx >= 0; mealIdx -= 1) {
        const dayMealFoods = mealFoods.filter(
          mealFood => (mealFood.mealId === mealIdx));

        for (let dmfIdx = dayMealFoods.length - 1; dmfIdx >= 0; dmfIdx -= 1) {
          const dayMealFood = dayMealFoods[dmfIdx];
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
          tripId={this.props.trip._id}
          day={day}
          mealFoods={mealFoods}
          dayTotals={dayTotals}
          weightLeft={currWeight}
          resupplyWeight={resupplyWeight}
          useOz={this.props.useOz}
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
    const { trip, days, loading, tripExists } = this.props;
    const numDays = days.length;
    if (!tripExists) {
      return <NotFoundPage />;
    }
    if (loading) {
      return (
        <div>loading</div>
      );
    }
    return (
      <div>

        <TripDetails
          calsPerDay={trip.calsPerDay}
          proteinPerDay={trip.proteinPerDay}
          tripId={trip._id}
          numDays={numDays}
          tripName={trip.name}
          removeTrip={this.removeTrip}
        />

        {this.renderDays()}
        <div className={classNames('row', 'end-xs')}>
          <div className="col-xs-2">
            <FloatingActionButton
              onClick={this.handleAddDay}
              secondary
              style={{ marginBottom: '16px' }}
            >
              <ContentAdd />
            </FloatingActionButton>
          </div>
        </div>
      </div>
    );
  }
}

TripPage.propTypes = {
  trip: PropTypes.object,
  days: PropTypes.arrayOf(PropTypes.object).isRequired,
  mealFoods: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.object,
  removeTrip: PropTypes.func.isRequired,
  handleOpenFoodDrawer: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  tripExists: PropTypes.bool.isRequired,
  useOz: PropTypes.bool,
};
