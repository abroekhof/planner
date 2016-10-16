import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  const winston = require('winston');

  const console = new winston.transports.Console({
    name: 'console',
    timestamp: true,
  });
  export const logger = new winston.Logger({
    transports: [
      console,
    ],
  });
} else {
  export const logger = {
    info: console.log,
    warn: console.log,
    error: console.log,
  };
}
