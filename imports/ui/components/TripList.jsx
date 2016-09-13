import React from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';

import { List, ListItem } from 'material-ui/List';

export default class TripList extends React.Component {
  constructor(props) {
    super(props);

    this.createNewTrip = this.createNewTrip.bind(this);
  }

  createNewTrip() {
    const { router } = this.context;
    Meteor.call('trips.insert', this.props.sessionId, (err, result) => {
      if (err) {
        router.push('/');
      } else {
        router.push(`/trips/${result}`);
      }
    });
  }

  render() {
    const { trips } = this.props;
    return (
      <List>
        <ListItem primaryText="Create New Trip" onClick={this.createNewTrip} />
        {trips.map(trip => (
          <ListItem
            primaryText={trip.name}
            key={trip._id}
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
  trips: React.PropTypes.array,
  sessionId: React.PropTypes.string,
};

TripList.contextTypes = {
  router: React.PropTypes.object,
};
