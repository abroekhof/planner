/* eslint-env mocha */

import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { assert } from 'meteor/practicalmeteor:chai';

import Foods from './foods.js';

Factory.define('foods', Foods, {});

if (Meteor.isServer) {
  describe('foods', () => {
    beforeEach(() => {
      resetDatabase();
    });

    it('builds correctly from factory', () => {
      const food = Factory.create('foods', {
        name: 'test',
        calories: 100,
        caloriesPerWeight: 33,
        protein: 10,
        proteinPerWeight: 3,
        weight: 3,
      });
      assert.typeOf(food, 'object');
    });
  });
}
