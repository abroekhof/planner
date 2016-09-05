import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { createContainer } from 'meteor/react-meteor-data';

// XXX: Session
import Trips from '../../api/trips.js';
import Foods from '../../api/foods.js';

import App from '../layouts/App.jsx';


// Store the sort order for the Food list
const foodSort = new ReactiveVar('name');

export default createContainer(() => {
  const tripsHandle = Meteor.subscribe('trips');
  const foodsHandle = Meteor.subscribe('foods');
  const foodOpt = { sort: {} };
  foodOpt.sort[foodSort.get()] = -1;
  return {
    user: Meteor.user(),
    loading: !tripsHandle.ready() || !foodsHandle.ready(),
    connected: Meteor.status().connected,
    trips: Trips.find().fetch(),
    foods: Foods.find({}, foodOpt).fetch(),
    foodSort,
  };
}, App);
