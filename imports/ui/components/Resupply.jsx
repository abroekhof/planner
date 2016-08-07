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
    const { day, idx } = this.props;

    if (day.resupply === idx) {
      return <span>Resupply here!</span>;
    }
    return <button onClick={this.insert}>Add resupply {idx}</button>;
  }
}

Resupply.propTypes = {
  day: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
};

export default Resupply;
