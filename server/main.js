import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

SimpleSchema.debug = true;

import '/imports/startup/server';

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
