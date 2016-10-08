import { Meteor } from 'meteor/meteor';

import { _ } from 'meteor/underscore';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Foods from '../imports/api/foods/foods';
import { gPerOz } from '../imports/ui/helpers.js';

SimpleSchema.debug = true;

import '/imports/startup/server';


Meteor.startup(() => {
  ServiceConfiguration.configurations.upsert(
    { service: 'google' },
    {
      $set: {
        clientId: Meteor.settings.google.clientId,
        loginStyle: 'popup',
        secret: Meteor.settings.google.secret,
      },
    }
  );
  const foods = JSON.parse(Assets.getText('foods.json'));
  _.each(foods, (food) => {
    if (food.Weight > 0) {
      const weight = (food.Weight * gPerOz) / food['Servings per container'];
      Foods.upsert(
        { name: food.Name },
        { $set: {
          verified: true,
          name: food.Name,
          calories: food.Calories,
          caloriesPerWeight: food.Calories / weight,
          protein: food.Protein,
          proteinPerWeight: food.Protein / weight,
          weight,
        },
    });
    }
  });
});
