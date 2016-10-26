/* eslint-env browser  */
import React, { PropTypes, Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { analytics } from 'meteor/okgrow:analytics';

import { List } from 'material-ui/List';


import Food from './Food.jsx';

export default class FoodList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const selectedIds = this.props.selectedFoods.map(food => (food._id));
    return (
      <List>
        {this.props.foods.map(food => (
          _.contains(selectedIds, food._id) ? '' :
            <Food
              key={food._id}
              food={food}
              defaultChecked={false}
              selectFood={this.props.selectFood}
              unselectFood={this.props.unselectFood}
              useOz={this.props.useOz}
              editingFood={this.props.editingFood}
            />
        ))}
      </List>
    );
  }
}

FoodList.propTypes = {
  foods: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedFoods: PropTypes.arrayOf(PropTypes.object).isRequired,
  useOz: PropTypes.bool.isRequired,
  selectFood: PropTypes.func.isRequired,
  unselectFood: PropTypes.func.isRequired,
  editingFood: PropTypes.func.isRequired,
};
