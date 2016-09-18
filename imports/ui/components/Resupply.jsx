import React, { PropTypes, Component } from 'react';

import { ListItem } from 'material-ui/List';

import { Meteor } from 'meteor/meteor';

import { convertWeight } from '../helpers.js';

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
    const { day, idx, weight, useOz } = this.props;

    if (day.resupply === idx) {
      return (
        <ListItem
          onClick={this.remove}
          primaryText={`Resupply here, weighing ${convertWeight(weight, useOz)}`}
          secondaryText="click to remove"
        />
      );
    }
    return (<ListItem
      onClick={this.insert}
      secondaryText="click to add resupply"
    />);
  }
}

Resupply.propTypes = {
  day: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  weight: PropTypes.number,
  useOz: PropTypes.bool.isRequired,
};

export default Resupply;
