import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Foods from '../foods';

Meteor.publish('foods', function publishFoods(name, opts) {
  check(name, String);
  check(opts, Object);
  const search = {
    $and: [
      {
        $or: [
          { userId: this.userId },
          { verified: true },
        ],
      },
      { duplicateOf: { $exists: false } },
    ],
  };
  if (name !== '') {
    search.$and.push({ $text: { $search: name } });
  }
  const foods = Foods.find(search, opts);
  return foods;
});
