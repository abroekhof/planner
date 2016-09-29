import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

SimpleSchema.debug = true;

import '../imports/api/foods.js';
import '../imports/api/days.js';
import '../imports/api/meals.js';
import '../imports/api/mealFoods.js';
import '../imports/api/trips.js';
import '../imports/api/accounts.js';

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
