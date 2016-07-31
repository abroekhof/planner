import { Meteor } from 'meteor/meteor';
// XXX: Session
import { Trips } from '../../api/trips.js';
import { createContainer } from 'meteor/react-meteor-data';
import App from '../layouts/App.jsx';

export default createContainer(() => {
  const tripsHandle = Meteor.subscribe('trips');
  return {
    user: Meteor.user(),
    loading: !tripsHandle.ready(),
    connected: Meteor.status().connected,
    trips: Trips.find().fetch(),
  };
}, App);
