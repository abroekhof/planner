import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import MealFoods from '../mealFoods/mealFoods';
import Meals from '../meals/meals';

class DaysCollection extends Mongo.Collection {}

const Days = new DaysCollection('days');

Days.schema = new SimpleSchema({
  resupply: {
    type: Number,
    optional: true,
  },
  tripId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: false,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});

Days.attachSchema(Days.schema);

Days.helpers({
  meals() {
    return Meals.find({ dayId: this._id });
  },
  mealFoods() {
    return MealFoods.find({ dayId: this._id });
  },
});

export default Days;
