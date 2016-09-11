import { Meteor } from 'meteor/meteor';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

SimpleSchema.debug = true;

import '../imports/api/foods.js';
import '../imports/api/days.js';
import '../imports/api/meals.js';
import '../imports/api/mealFoods.js';
import '../imports/api/trips.js';
import '../imports/api/accounts.js';

Meteor.startup(() => {
  // code to run on server at startup
});
