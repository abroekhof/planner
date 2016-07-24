import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

class DaysCollection extends Mongo.Collection {}

export const Days = new DaysCollection('days');

Meteor.methods({
  'days.insert'() {
    Days.insert({
      createdAt: new Date(),
    });
  },
  'days.remove'(dayId) {
    check(dayId, String);
    Days.remove(dayId);
  },
});
