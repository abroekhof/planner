import React, { PropTypes } from 'react';

const styles = {
  display: 'inline-block',
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  cursor: 'move',
};

const FoodDragPreview = (props) => {
  const { title } = props;
  return (
    <div style={styles}>
      {title}
    </div>
  );
};

FoodDragPreview.propTypes = {
  title: PropTypes.string.isRequired,
};

export default FoodDragPreview;
