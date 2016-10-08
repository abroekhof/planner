/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Factory } from 'meteor/dburles:factory';
import { assert } from 'meteor/practicalmeteor:chai';


import Foods from './foods';
import verifyFood from './server/methods';

Factory.define('foods', Foods, {});

if (Meteor.isServer) {
  require('./server/schema');

  describe('foods', function foods() {
    it('builds correctly from factory', function factoryBuild() {
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

    describe('methods', function methods() {
      describe('foods.verify', function foodsVerify() {
        beforeEach(function beforeEach() {
          resetDatabase();
        });

        it('should verify equal foods', function sameFoods() {
          const f = {
            name: 'test',
            calories: 100,
            caloriesPerWeight: 33,
            protein: 10,
            proteinPerWeight: 3,
            weight: 3,
          };
          const food = Factory.create('foods', f);
          const newFoodId = verifyFood(Random.id(), null, f.name, f.calories, f.protein, f.weight);
          assert.strictEqual(food._id, newFoodId);
        });

        it('should verify similar foods', function similarFoods() {
          const f = {
            name: 'ONE TEST',
            calories: 100,
            caloriesPerWeight: 33,
            protein: 10,
            proteinPerWeight: 3,
            weight: 3,
          };
          const food = Factory.create('foods', f);
          const newFoodId = verifyFood(Random.id(), null, 'test one', f.calories * 1.01, f.protein * 1.01, f.weight * 1.01);
          assert.strictEqual(food._id, newFoodId);
        });

        it('should not verify when foods are different', function different() {
          const f = {
            name: 'Peanut Clif Bar',
            calories: 100,
            caloriesPerWeight: 33,
            protein: 10,
            proteinPerWeight: 3,
            weight: 3,
          };
          const food = Factory.create('foods', f);
          const newFoodId = verifyFood(Random.id(), null, 'Chocolate', f.calories * 1.5, f.protein * 1.5, f.weight * 1.5);
          assert.notStrictEqual(food._id, newFoodId);
        });

        it('should not verify when brand names are the same', function brandNames() {
          const f = {
            name: 'Peanut Clif Bar',
            calories: 100,
            caloriesPerWeight: 33,
            protein: 10,
            proteinPerWeight: 3,
            weight: 3,
          };
          const food = Factory.create('foods', f);
          const newFoodId = verifyFood(Random.id(), null, 'Chocolate Clif Bar', f.calories, f.protein, f.weight);
          assert.notStrictEqual(food._id, newFoodId);
        });
      });
    });
  });
}
