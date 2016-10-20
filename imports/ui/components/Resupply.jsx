import React, { PropTypes, Component } from 'react';

import { ListItem } from 'material-ui/List';

import { Meteor } from 'meteor/meteor';
import { analytics } from 'meteor/okgrow:analytics';

import { convertWeight } from '../helpers';

class Resupply extends Component {
  constructor(props) {
    super(props);
    this.insert = this.insert.bind(this);
    this.remove = this.remove.bind(this);
  }

  insert() {
    const { day, idx } = this.props;
    analytics.track('Inserted resupply', { dayId: day._id, idx });
    Meteor.call('days.updateResupply', day._id, idx);
  }

  remove() {
    const { day, idx } = this.props;
    analytics.track('Removed resupply', { dayId: day._id, idx });
    Meteor.call('days.removeResupply', day._id, idx);
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
