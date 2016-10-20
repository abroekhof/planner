import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { analytics } from 'meteor/okgrow:analytics';

import { ListItem } from 'material-ui/List';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';

import { convertWeight, convertRatio } from '../helpers';

class Food extends Component {
  constructor(props) {
    super(props);
    this.deleteThisFood = this.deleteThisFood.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.editingFood = this.editingFood.bind(this);
  }

  onCheck(event, isInputChecked) {
    if (isInputChecked) {
      this.props.selectFood(this.props.food);
    } else {
      this.props.unselectFood(this.props.food._id);
    }
  }

  deleteThisFood() {
    analytics.track('Delete food', { foodId: this.props.food._id });
    this.props.unselectFood(this.props.food._id);
    Meteor.call('foods.remove', this.props.food._id);
  }

  editingFood() {
    this.props.editingFood(this.props.food);
  }

  render() {
    const iconButtonElement = (
      <IconButton
        touch
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );
    const { food, useOz } = this.props;

    const rightIconMenu = (Meteor.userId() === food.userId && !food.verified) ? (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick={this.deleteThisFood}>Delete</MenuItem>
        <MenuItem onClick={this.editingFood}>Edit</MenuItem>
      </IconMenu>
    ) : null;


    return (
      <ListItem
        leftCheckbox={<Checkbox onCheck={this.onCheck} checked={this.props.checked} />}
        primaryText={`${food.name} (${convertWeight(food.weight, useOz)} per serving)`}
        secondaryText={`${food.calories} calories (${convertRatio(food.caloriesPerWeight, useOz, 'cals')}),
        ${food.protein} g protein (${convertRatio(food.proteinPerWeight, useOz, 'g')})`}
        secondaryTextLines={2}
        rightIconButton={rightIconMenu}
      />
    );
  }
}

Food.propTypes = {
  food: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  selectFood: PropTypes.func.isRequired,
  unselectFood: PropTypes.func.isRequired,
  useOz: PropTypes.bool.isRequired,
  editingFood: PropTypes.func.isRequired,
};

export default Food;
