import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Days from '../days';

Meteor.publish('days.inTrip', (tripId) => {
  check(tripId, String);
  return Days.find({ tripId });
});
