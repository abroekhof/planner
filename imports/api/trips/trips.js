import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Days from '../days/days';
import MealFoods from '../mealFoods/mealFoods';

export const newTripName = 'New Trip';

class TripsCollection extends Mongo.Collection {
  remove(selector, callback) {
    // also remove all child days
    Days.remove({ tripId: selector });
    return super.remove(selector, callback);
  }
}

const Trips = new TripsCollection('trips');

Trips.helpers({
  days() {
    return Days.find({ tripId: this._id });
  },
  mealFoods() {
    return MealFoods.find({ tripId: this._id });
  },
  editableBy(userId) {
    if (!this.userId) {
      return true;
    }
    return this.userId === userId;
  },
  edited() {
    if (this.name !== newTripName) {
      return true;
    }
    if (this.days().count() > 1) {
      return true;
    }
    if (this.mealFoods().count() > 0) {
      return true;
    }
    return false;
  },
});

Trips.schema = new SimpleSchema({
  name: {
    type: String,
    max: 100,
    defaultValue: newTripName,
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
  calsPerDay: {
    type: Number,
    defaultValue: 3000,
  },
  useOz: {
    type: Boolean,
    defaultValue: true,
  },
  proteinPerDay: {
    type: Number,
    defaultValue: 100,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  sessionId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});

Trips.attachSchema(Trips.schema);

export default Trips;
