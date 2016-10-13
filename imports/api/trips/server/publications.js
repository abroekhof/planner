import { Meteor } from 'meteor/meteor';

import Trips from '../trips';

Meteor.publish('trips', function publishTrips() {
  return Trips.find({
    // $or: [
    //   { sessionId: this.connection.id },
    //   { $and: [
    //       { userId: this.userId },
    //       { userId: { $ne: null } },
    //   ] },
    // ],
  });
});
