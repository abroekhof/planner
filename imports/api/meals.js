import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import MealFoods from './mealFoods.js';
import Days from './days.js';

class MealsCollection extends Mongo.Collection {
  remove(selector, callback) {
    // also remove all child mealFoods
    MealFoods.remove({ mealId: selector });
    return super.remove(selector, callback);
  }
}

const Meals = new MealsCollection('meals');

Meals.schema = new SimpleSchema({
  name: {
    type: String,
    max: 100,
  },
  dayId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});

Meals.attachSchema(Meals.schema);

export default Meals;

Meals.helpers({
  mealFoods() {
    return MealFoods.find({ mealId: this._id });
  },
  day() {
    return Days.findOne(this.dayId);
  },
});
