import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Trips from '../../api/trips/trips';
import Days from '../../api/days/days';
import MealFoods from '../../api/mealFoods/mealFoods';
import TripPage from '../pages/TripPage.jsx';

/* global TripPageContainer:true */
export default TripPageContainer = createContainer(({ params: { tripId } }) => {
  const daysHandle = Meteor.subscribe('days.inTrip', tripId);
  const mealFoodsHandle = Meteor.subscribe('mealFoods.inTrip', tripId);
  const trip = Trips.findOne(tripId);
  const loading = !daysHandle.ready() && !mealFoodsHandle.ready();
  const tripExists = !loading && !!trip;

  return {
    trip,
    days: Days.find().fetch(),
    mealFoods: MealFoods.find().fetch(),
    currentUser: Meteor.user(),
    loading,
    tripExists,
  };
}, TripPage);
