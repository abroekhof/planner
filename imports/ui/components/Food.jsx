import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { DragSource } from 'react-dnd';

/**
 * Implements the drag source contract.
 */
const foodSource = {
  beginDrag(props) {
    return { food: props.food };
  },
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

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
    const { isDragging, connectDragSource } = this.props;
    return connectDragSource(
      <div className="food" style={{ opacity: isDragging ? 0.5 : 1 }}>
        <span className="icon-trash" onClick={this.deleteThisFood}></span>
          {food.name} {food.calories} calories, {food.protein} g protein, {food.weight} oz.
      </div>
      );
  }
}

Food.propTypes = {
  food: PropTypes.object.isRequired,
  // Injected by React DnD:
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
};

export default DragSource('food', foodSource, collect)(Food);
