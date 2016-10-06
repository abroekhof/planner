import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Trips from '../../api/trips/trips.js';
import Days from '../../api/days/days.js';
import Meals from '../../api/meals/meals.js';
import MealFoods from '../../api/mealFoods/mealFoods.js';
import TripPage from '../pages/TripPage.jsx';

/* global TripPageContainer:true */
export default TripPageContainer = createContainer(({ params: { tripId } }) => {
  const daysHandle = Meteor.subscribe('days.inTrip', tripId);
  const trip = Trips.findOne(tripId);
  const loading = !daysHandle.ready();
  const tripExists = !loading && !!trip;

  return {
    trip,
    days: Days.find().fetch(),
    meals: Meals.find().fetch(),
    mealFoods: MealFoods.find().fetch(),
    currentUser: Meteor.user(),
    loading,
    tripExists,
  };
}, TripPage);
