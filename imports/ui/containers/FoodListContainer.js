import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import Foods from '../../api/foods/foods';
import FoodList from '../components/FoodList.jsx';

export default createContainer(({ params }) => {
  const {
    useOz,
    searchString,
    foodOpts,
    selectFood,
    unselectFood,
    editingFood,
  } = params;
  const foodsHandle = Meteor.subscribe('foods', searchString, foodOpts);
  const foods = Foods.find({}, foodOpts).fetch();

  return {
    loading: !foodsHandle.ready(),
    connected: Meteor.status().connected,
    foods,
    foodOpts,
    searchString,
    useOz,
    selectFood,
    unselectFood,
    editingFood,
  };
}, FoodList);
