import React, { PropTypes, Component } from 'react';

import { Meteor } from 'meteor/meteor';

class Resupply extends Component {
  constructor(props) {
    super(props);
    this.insert = this.insert.bind(this);
    this.remove = this.remove.bind(this);
  }

  insert() {
    Meteor.call('days.updateResupply', this.props.day._id, this.props.idx);
  }

  remove() {
    Meteor.call('days.removeResupply', this.props.day._id, this.props.idx);
  }

  render() {
    const { day, idx, weight } = this.props;

    if (day.resupply === idx) {
      return (
        <span><button onClick={this.remove}>Remove</button>
          Resupply! Weighing {weight} oz.
        </span>
      );
    }
    return <button onClick={this.insert}>Add resupply</button>;
  }
}

Resupply.propTypes = {
  day: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  weight: PropTypes.number,
};

export default Resupply;
