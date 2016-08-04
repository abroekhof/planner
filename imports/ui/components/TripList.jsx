import React from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';

export default class TripList extends React.Component {
  constructor(props) {
    super(props);

    this.createNewTrip = this.createNewTrip.bind(this);
  }

  createNewTrip() {
    const { router } = this.context;
    Meteor.call('trips.insert', (err, result) => {
      if (err) {
        router.push('/');
        /* eslint-disable no-alert */
        alert(err);
      } else {
        router.push(`/trips/${result}`);
      }
    });
  }

  render() {
    const { trips } = this.props;
    return (
      <div className="list-trips">
        <a className="link-trip-new" onClick={this.createNewTrip}>
          <span className="icon-plus"></span>
          New Trip
        </a>
        {trips.map(trip => (
          <Link
            to={`/trips/${trip._id}`}
            key={trip._id}
            title={trip.name}
            className="list-trip"
            activeClassName="active"
          >
            {trip.name}
          </Link>
        ))}
      </div>
    );
  }
}

TripList.propTypes = {
  trips: React.PropTypes.array,
};

TripList.contextTypes = {
  router: React.PropTypes.object,
};
