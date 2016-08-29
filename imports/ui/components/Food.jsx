import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

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
    return {
      food: props.food,
      title: props.food.name,
    };
  },
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

class Food extends Component {
  constructor(props) {
    super(props);
    this.deleteThisFood = this.deleteThisFood.bind(this);
  }

  componentDidMount() {
   // Use empty image as a drag preview so browsers don't draw it
   // and we can draw whatever we want on the custom drag layer instead.
    this.props.connectDragPreview(getEmptyImage(), {
     // IE fallback: specify that we'd rather screenshot the node
     // when it already knows it's being dragged so we can hide it with CSS.
      captureDraggingState: true,
    });
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
          primaryText={`${food.name}`}
          secondaryText={`${food.calories} calories,
          ${food.protein} g protein, ${food.weight} oz.`}
          secondaryTextLines={2}
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
  connectDragPreview: PropTypes.func.isRequired,
};

export default DragSource('food', foodSource, collect)(Food);
