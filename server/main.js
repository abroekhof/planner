import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

SimpleSchema.debug = true;

import '../imports/api/foods/foods.js';
import '../imports/api/days/days.js';
import '../imports/api/meals/meals.js';
import '../imports/api/mealFoods/mealFoods.js';
import '../imports/api/trips/trips.js';
import '../imports/api/accounts/accounts.js';

Meteor.startup(() => {
  ServiceConfiguration.configurations.upsert(
    { service: 'google' },
    {
      $set: {
        loginStyle: 'popup',
      },
    }
);
});
