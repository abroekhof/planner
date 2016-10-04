import { Meteor } from 'meteor/meteor';
import Foods from '../foods.js';

Meteor.publish('foods', function publishFoods() {
  return Foods.find({ $or: [{ userId: this.userId }, { verified: true }] });
});
