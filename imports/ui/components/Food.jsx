import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { DragSource } from 'react-dnd';

import { ListItem } from 'material-ui/List';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

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
    const { isDragging, connectDragSource } = this.props;
    return connectDragSource(
      <div style={{ opacity: isDragging ? 0.5 : 1 }}>
        <ListItem
          primaryText={food.name + ' ' + food.calories + ' calories, '
          + food.protein + ' g protein, ' + food.weight + ' oz.'}
          rightIconButton={rightIconMenu}
        />
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
