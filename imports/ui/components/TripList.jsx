import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import { Meteor } from 'meteor/meteor';
import { analytics } from 'meteor/okgrow:analytics';

import { List, ListItem } from 'material-ui/List';
import ContentAddBox from 'material-ui/svg-icons/content/add-box';
import Subheader from 'material-ui/Subheader';

export default class TripList extends React.Component {
  constructor(props) {
    super(props);
    this.createNewTrip = this.createNewTrip.bind(this);
  }

  createNewTrip() {
    const { router } = this.context;
    this.props.handleClose();
    Meteor.call('trips.insert', (err, result) => {
      if (err) {
        router.push('/');
      } else {
        analytics.track('Created new trip', { tripId: result });
        router.push(`/trips/${result}`);
      }
    });
  }

  render() {
    const { trips } = this.props;
    return (
      <List>
        <ListItem
          primaryText="Create New Trip"
          onTouchTap={this.createNewTrip}
          leftIcon={<ContentAddBox />}
        />
        <Subheader>My Trips</Subheader>
        {trips.map(trip => (
          <ListItem
            primaryText={trip.name}
            key={trip._id}
            onTouchTap={this.props.handleClose}
            containerElement={
              <Link
                to={`/trips/${trip._id}`}
                title={trip.name}
                activeClassName="active"
              />
            }
          />
        ))}
      </List>
    );
  }
}

TripList.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.object),
  handleClose: PropTypes.func,
};

TripList.contextTypes = {
  router: React.PropTypes.object,
};
