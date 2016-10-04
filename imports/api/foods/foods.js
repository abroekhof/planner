import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Match, check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import MealFoods from '../mealFoods/mealFoods.js';

const Foods = new Mongo.Collection('foods');

Foods.schema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  verified: {
    type: Boolean,
    defaultValue: false,
  },
  name: {
    type: String,
    max: 100,
  },
  calories: {
    type: Number,
    decimal: true,
  },
  caloriesPerWeight: {
    type: Number,
    decimal: true,
  },
  protein: {
    type: Number,
    decimal: true,
  },
  proteinPerWeight: {
    type: Number,
    decimal: true,
  },
  weight: {
    type: Number,
    decimal: true,
  },
});

Foods.attachSchema(Foods.schema);

export default Foods;

if (Meteor.isServer) {
  // create a full text search index for Food name
  Foods._ensureIndex({
    name: 'text',
  });
  Meteor.publish('foods', function publishFoods() {
    return Foods.find({ $or: [{ userId: this.userId }, { verified: true }] });
  });
  Meteor.methods({
    'foods.verify': function foodsVerify(foodId, name, calories, protein, weight) {
      if (!this.userId) {
        throw new Meteor.Error('foods.verify.accessDenied',
          'Cannot create a food when not logged in');
      }
      check(foodId, Match.Maybe(String));
      if (foodId) {
        const food = Foods.findOne(foodId);
        if (this.userId !== food.userId) {
          throw new Meteor.Error('foods.remove.accessDenied',
            'Cannot update a food that does not belong to you');
        }
        if (food.verified) {
          throw new Meteor.Error('foods.remove.accessDenied',
            'Cannot update a food that has been verified');
        }
      }
      check(name, String);
      check(calories, Number);
      check(protein, Number);
      check(weight, Number);
      const foundFood = Foods.findOne(
        {
          $and: [
            { $text: { $search: name } },
            { calories: { $lte: calories * 1.05 } },
            { calories: { $gte: calories * 0.95 } },
            { protein: { $lte: protein * 1.05 } },
            { protein: { $gte: protein * 0.95 } },
            { weight: { $lte: weight * 1.05 } },
            { weight: { $gte: weight * 0.95 } },
            { userId: { $ne: this.userId } },
          ],
        },
        { fields: { score: { $meta: 'textScore' } },
        sort: { score: { $meta: 'textScore' } },
        }
      );
      if (foundFood) {
        // food was found, update it to make sure it's verified
        Foods.update(foundFood._id, { $set: { verified: true } });
        if (foodId) {
          // an update was requested which verified a food, so change any previous MealFoods to use
          // the new food, and delete the old food
          MealFoods.update(
            { foodId },
            { $set: {
              foodId: foundFood._id,
              name: foundFood.name,
              calories: foundFood.calories,
              caloriesPerWeight: foundFood.caloriesPerWeight,
              protein: foundFood.protein,
              proteinPerWeight: foundFood.proteinPerWeight,
              weight: foundFood.weight,
            },
          });
          Foods.remove(foodId);
        }
        return foundFood._id;
      }
      // no closely matching food was found
      if (foodId) {
        // a food update was requested
        Foods.update(
          foodId,
          { $set: {
            name,
            calories,
            caloriesPerWeight: calories / weight,
            protein,
            proteinPerWeight: protein / weight,
            weight,
          },
        });
        MealFoods.update(
          { foodId },
          { $set: {
            name,
            calories,
            caloriesPerWeight: calories / weight,
            protein,
            proteinPerWeight: protein / weight,
            weight,
          },
        });
        return foodId;
      }
      // no matching food and no update, so just create a new food
      return Foods.insert({
        userId: this.userId,
        name,
        calories,
        caloriesPerWeight: calories / weight,
        protein,
        proteinPerWeight: protein / weight,
        weight,
      });
    },
  });
}

Meteor.methods({
  'foods.insert': function foodsInsert(name, calories, protein, weight) {
    if (!this.userId) {
      throw new Meteor.Error('foods.insert.accessDenied',
        'Cannot create a food when not logged in');
    }
    check(name, String);
    check(calories, Number);
    check(protein, Number);
    check(weight, Number);

    return Foods.insert({
      userId: this.userId,
      name,
      calories,
      caloriesPerWeight: calories / weight,
      protein,
      proteinPerWeight: protein / weight,
      weight,
    });
  },
  'foods.update': function foodsUpdate(foodId, name, calories, protein, weight) {
    if (!this.userId) {
      throw new Meteor.Error('foods.insert.accessDenied',
        'Cannot create a food when not logged in');
    }
    const food = Foods.findOne(foodId);
    if (this.userId !== food.userId) {
      throw new Meteor.Error('foods.remove.accessDenied',
        'Cannot update a food that does not belong to you');
    }
    if (food.verified) {
      throw new Meteor.Error('foods.remove.accessDenied',
        'Cannot update a food that has been verified');
    }
    check(foodId, String);
    check(name, String);
    check(calories, Number);
    check(protein, Number);
    check(weight, Number);
    Foods.update(
      foodId,
      { $set: {
        name,
        calories,
        caloriesPerWeight: calories / weight,
        protein,
        proteinPerWeight: protein / weight,
        weight,
      },
    });
    MealFoods.update(
      { foodId },
      { $set: {
        name,
        calories,
        caloriesPerWeight: calories / weight,
        protein,
        proteinPerWeight: protein / weight,
        weight,
      },
    });
  },
  'foods.remove': function foodsRemove(foodId) {
    const food = Foods.findOne(foodId);
    if (this.userId !== food.userId) {
      throw new Meteor.Error('foods.remove.accessDenied',
        'Cannot delete a food that does not belong to you');
    }
    if (food.verified) {
      throw new Meteor.Error('foods.remove.accessDenied',
        'Cannot delete a food that has been verified');
    }
    check(foodId, String);

    Foods.remove(foodId);
    // delete any MealFoods which use this food
    MealFoods.remove({ foodId });
  },
});
