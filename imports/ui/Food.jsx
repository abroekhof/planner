import React, { Component, PropTypes } from 'react';

class Food extends Component {

  render() {
    const food = this.props.food;
    return (
      <div>
        <span>{food.name} {food.calories} calories, {food.protein} g. protein</span>
      </div>
    );
  }
}

Food.propTypes = {
  food: PropTypes.object.isRequired,
};

export default Food;
