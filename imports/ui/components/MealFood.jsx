import React, { PropTypes, Component } from 'react';

import { ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import TextField from 'material-ui/TextField';

import { Meteor } from 'meteor/meteor';

import { convertWeight } from '../helpers';

class MealFood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: this.props.mealFood.qty,
    };
    this.delete = this.delete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ qty: props.mealFood.qty });
  }

  delete() {
    Meteor.call('mealFoods.remove', this.props.mealFood._id);
  }

  handleChange(e) {
    this.setState({ qty: e.target.value });
  }

  handleBlur() {
    const qty = this.state.qty;
    if (!isNaN(parseFloat(qty)) && isFinite(qty) && Number(qty) > 0) {
      Meteor.call('mealFoods.updateQty', this.props.mealFood._id, Number(qty));
      this.setState({ qty: Number(qty) });
    } else {
      this.setState({ qty: this.props.mealFood.qty });
    }
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      e.target.blur();
    }
  }

  render() {
    const { mealFood, useOz } = this.props;
    return (
      <ListItem
        disabled
        style={{ padding: 8 }}
        rightIconButton={
          <IconButton
            tooltip={`Delete ${this.props.mealFood.name}`}
            onClick={this.delete}
          >
            <Delete />
          </IconButton>
        }
      >
        <span>
          <TextField
            id={mealFood._id}
            value={this.state.qty}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            style={{ width: '36px', height: '36px' }}
            inputStyle={{ textAlign: 'center' }}
          />
          {this.state.qty > 1 ? 'servings' : 'serving'} ({convertWeight(this.state.qty * mealFood.weight, useOz)}) {mealFood.name}
        </span>

      </ListItem>
    );
  }
}

MealFood.propTypes = {
  mealFood: PropTypes.object.isRequired,
  useOz: PropTypes.bool.isRequired,
};

export default MealFood;
