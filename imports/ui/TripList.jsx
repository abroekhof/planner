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
    const tripId = Meteor.call('trips.insert', (err) => {
      if (err) {
        router.push('/');
        /* eslint-disable no-alert */
        alert(err);
      }
    });
    router.push(`/trips/${tripId}`);
  }

  render() {
    const { trips } = this.props;
    return (
      <div className="list-todos">
        <a className="link-list-new" onClick={this.createNewTrip}>
          <span className="icon-plus"></span>
          New List
        </a>
        {trips.map(trip => (
          <Link
            to={`/trips/${trip._id}`}
            key={trip._id}
            title={trip.name}
            className="list-todo"
            activeClassName="active"
          >
            {trip._id}
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
