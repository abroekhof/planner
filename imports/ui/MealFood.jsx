import React, { PropTypes, Component } from 'react';

import { Meteor } from 'meteor/meteor';

class MealFood extends Component {
  constructor(props) {
    super(props);
    this.deleteThisMealFood = this.deleteThisMealFood.bind(this);
  }

  deleteThisMealFood() {
    Meteor.call('mealFoods.remove', this.props.mealFood._id);
  }

  render() {
    return (
      <li>
        <button className="delete" onClick={this.deleteThisMealFood}>
          &times;
        </button>
        <span>{this.props.mealFood.qty} {this.props.food.name}</span>
      </li>
    );
  }
}

MealFood.propTypes = {
  mealFood: PropTypes.object.isRequired,
  food: PropTypes.object.isRequired,
};

export default MealFood;
