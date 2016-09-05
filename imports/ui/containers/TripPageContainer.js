import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Foods from '../../api/foods.js';
import Trips from '../../api/trips.js';
import Days from '../../api/days.js';
import Meals from '../../api/meals.js';
import MealFoods from '../../api/mealFoods.js';
import TripPage from '../pages/TripPage.jsx';

/* global TripPageContainer:true */
export default TripPageContainer = createContainer(({ params: { tripId } }) => {
  Meteor.subscribe('days.inTrip', tripId);
  Meteor.subscribe('foods');
  return {
    trip: Trips.findOne(tripId),
    foods: Foods.find().fetch(),
    days: Days.find().fetch(),
    meals: Meals.find().fetch(),
    mealFoods: MealFoods.find().fetch(),
    currentUser: Meteor.user(),
  };
}, TripPage);
