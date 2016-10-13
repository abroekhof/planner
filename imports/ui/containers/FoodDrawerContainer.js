import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { createContainer } from 'meteor/react-meteor-data';

import Foods from '../../api/foods/foods';

import FoodDrawer from '../components/FoodDrawer.jsx';

// Store the sort order for the Food list
const foodOpts = new ReactiveVar({ sort: { name: -1 }, limit: 50 });
const searchString = new ReactiveVar('');

export default createContainer(({ params }) => {
  const opts = foodOpts.get();
  const foodsHandle = Meteor.subscribe('foods', searchString.get(), opts);

  const foods = Foods.find({}, opts).fetch();
  const {
    handleCloseDrawer,
    useOz,
    mealId,
    dayId,
    tripId } = params;

  return {
    loading: !foodsHandle.ready(),
    connected: Meteor.status().connected,
    foods,
    foodOpts,
    searchString,
    handleCloseDrawer,
    useOz,
    mealId,
    dayId,
    tripId,
  };
}, FoodDrawer);
