import { Meteor } from 'meteor/meteor';
// XXX: Session
import { Trips } from '../../api/trips.js';
import { Foods } from '../../api/foods.js';
import { createContainer } from 'meteor/react-meteor-data';
import App from '../layouts/App.jsx';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

export default createContainer(() => {
  const tripsHandle = Meteor.subscribe('trips');
  const foodsHandle = Meteor.subscribe('foods');
  return {
    user: Meteor.user(),
    loading: !tripsHandle.ready() || !foodsHandle.ready(),
    connected: Meteor.status().connected,
    trips: Trips.find().fetch(),
    foods: Foods.find().fetch(),
  };
}, DragDropContext(
      HTML5Backend
    )(App));
