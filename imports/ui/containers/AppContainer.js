import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
// XXX: Session
import { Trips } from '../../api/trips.js';
import { Foods } from '../../api/foods.js';
import { createContainer } from 'meteor/react-meteor-data';
import App from '../layouts/App.jsx';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

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
}, DragDropContext(
      HTML5Backend
    )(App));
