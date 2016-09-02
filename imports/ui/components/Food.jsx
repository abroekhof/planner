import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { ListItem } from 'material-ui/List';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';


class Food extends Component {
  constructor(props) {
    super(props);
    this.deleteThisFood = this.deleteThisFood.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  onCheck(event, isInputChecked) {
    if (isInputChecked) {
      this.props.addSelectedFood(this.props.food._id);
    } else {
      this.props.removeSelectedFood(this.props.food._id);
    }
  }

  deleteThisFood() {
    Meteor.call('foods.remove', this.props.food._id);
  }

  render() {
    const iconButtonElement = (
      <IconButton
        touch
      >
        <MoreVertIcon color={grey400} />
      </IconButton>
    );

    const rightIconMenu = (
      <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem onClick={this.deleteThisFood}>Delete</MenuItem>
      </IconMenu>
    );

    const food = this.props.food;
    return (
      <ListItem
        leftCheckbox={<Checkbox onCheck={this.onCheck} checked={this.props.checked} />}
        primaryText={`${food.name}`}
        secondaryText={`${food.calories} calories,
        ${food.protein} g protein, ${food.weight} oz.`}
        secondaryTextLines={2}
        rightIconButton={rightIconMenu}
      />
    );
  }
}

Food.propTypes = {
  food: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  addSelectedFood: PropTypes.func.isRequired,
  removeSelectedFood: PropTypes.func.isRequired,
};

export default Food;
