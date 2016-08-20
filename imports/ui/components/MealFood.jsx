import React, { PropTypes, Component } from 'react';
import { RIENumber } from 'riek';

import { ListItem } from 'material-ui/List';

import { Meteor } from 'meteor/meteor';

class MealFood extends Component {
  constructor(props) {
    super(props);
    this.delete = this.delete.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.updateQty = this.updateQty.bind(this);
  }

  delete() {
    Meteor.call('mealFoods.remove', this.props.mealFood._id);
  }

  increment() {
    const mealFood = this.props.mealFood;
    Meteor.call('mealFoods.updateQty', mealFood._id, mealFood.qty + 1);
  }

  decrement() {
    const mealFood = this.props.mealFood;
    Meteor.call('mealFoods.updateQty', mealFood._id, mealFood.qty - 1);
  }

  updateQty(obj) {
    Meteor.call('mealFoods.updateQty', this.props.mealFood._id, Number(obj.qty));
  }

  render() {
    return (
      <ListItem disabled style={{ padding: 8 }}>
        <button className="delete" onClick={this.delete}>
          &times;
        </button>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <span>
          <RIENumber
            value={this.props.mealFood.qty}
            propName="qty"
            change={this.updateQty}
          /> {this.props.food.name}</span>
      </ListItem>
    );
  }
}

MealFood.propTypes = {
  mealFood: PropTypes.object.isRequired,
  food: PropTypes.object.isRequired,
};

export default MealFood;
