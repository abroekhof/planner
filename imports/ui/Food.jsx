import React, { PropTypes } from 'react';

const Food = (props) => {
  const food = props.food;
  return (
    <div>
      <span>{food.name} {food.calories} calories, {food.protein} g protein</span>
    </div>
  );
};

Food.propTypes = {
  food: PropTypes.object.isRequired,
};

export default Food;
