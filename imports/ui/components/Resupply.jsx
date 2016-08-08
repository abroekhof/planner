import React, { PropTypes, Component } from 'react';

import { Meteor } from 'meteor/meteor';

class Resupply extends Component {
  constructor(props) {
    super(props);
    this.insert = this.insert.bind(this);
  }

  insert() {
    Meteor.call('days.updateResupply', this.props.day._id, this.props.idx);
  }

  render() {
    const { day, idx, weight } = this.props;

    if (day.resupply === idx) {
      return <span>Resupply! Weighing {weight} oz.</span>;
    }
    return <button onClick={this.insert}>Add resupply {idx}</button>;
  }
}

Resupply.propTypes = {
  day: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  weight: PropTypes.number,
};

export default Resupply;
