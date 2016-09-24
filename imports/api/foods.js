import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Foods = new Mongo.Collection('foods');

Foods.schema = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  verified: {
    type: Boolean,
    defaultValue: true,
  },
  name: {
    type: String,
    max: 100,
  },
  calories: {
    type: Number,
    decimal: true,
  },
  protein: {
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
  Meteor.publish('foods', () => (
    Foods.find({ $or: [{ userId: this.userId }, { verified: true }] })
  ));
  Meteor.methods({
    'foods.verify': function foodsInsert(name, calories, protein, weight) {
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
          ],
        },
        { fields: { score: { $meta: 'textScore' } },
        sort: { score: { $meta: 'textScore' } },
        }
      );
      if (foundFood) {
        Foods.update(foundFood._id, { $set: { verified: true } });
      }
      return foundFood;
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
      protein,
      weight,
    });
  },
  'foods.remove': function foodsRemove(foodId) {
    check(foodId, String);

    Foods.remove(foodId);
  },
});
