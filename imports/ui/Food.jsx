import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Food extends Component {
  constructor(props) {
    super(props);
    this.deleteThisFood = this.deleteThisFood.bind(this);
  }

  deleteThisFood() {
    Meteor.call('foods.remove', this.props.food._id);
  }

  render() {
    const food = this.props.food;
    return (
      <div>
        <button className="delete" onClick={this.deleteThisFood}>
            &times;
        </button>
        <span>
          {food.name} {food.calories} calories, {food.protein} g protein, {food.weight} oz.
        </span>
      </div>
      );
  }
}

Food.propTypes = {
  food: PropTypes.object.isRequired,
};

export default Food;
