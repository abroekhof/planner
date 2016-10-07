import { Meteor } from 'meteor/meteor';
import Foods from '../foods';

Meteor.publish('foods', function publishFoods() {
  return Foods.find({
    $and: [
      {
        $or: [
          { userId: this.userId },
          { verified: true },
        ],
      },
      {
        duplicateOf: { $exists: false },
      },
    ],
  });
});
