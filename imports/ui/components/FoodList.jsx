/* eslint-env browser  */
import React, { PropTypes, Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { analytics } from 'meteor/okgrow:analytics';

import { List } from 'material-ui/List';


import Food from './Food.jsx';

export default class FoodList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <List>
        {this.props.foods.map(food => (
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
  useOz: PropTypes.bool.isRequired,
  selectFood: PropTypes.func.isRequired,
  unselectFood: PropTypes.func.isRequired,
  editingFood: PropTypes.func.isRequired,
};
