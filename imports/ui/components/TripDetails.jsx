import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { Card, CardText, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import Toggle from 'material-ui/Toggle';

const styles = {
  toggle: {
    marginBottom: 16,
  },
};

export default class TripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calsPerDay: props.calsPerDay,
      proteinPerDay: props.proteinPerDay,
    };
    this.updateCalorieState = this.updateCalorieState.bind(this);
    this.updateProteinState = this.updateProteinState.bind(this);
    this.updateTargets = this.updateTargets.bind(this);
  }

  updateCalorieState(e, value) {
    this.setState({ calsPerDay: value });
  }

  updateProteinState(e, value) {
    this.setState({ proteinPerDay: value });
  }

  updateTargets() {
    Meteor.call('trips.updateTarget',
      this.props.tripId,
      'calsPerDay',
      this.state.calsPerDay);
    Meteor.call('trips.updateTarget',
      this.props.tripId,
      'proteinPerDay',
      this.state.proteinPerDay);
  }

  render() {
    const dayNoun = this.props.numDays > 1 ? ' days' : ' day';
    return (
      <Card style={{ margin: '8px' }}>
        <CardTitle
          title={this.props.tripName}
          subtitle={`${this.props.numDays} ${dayNoun}`}
        />
        <CardText>
          <Slider
            description={`${this.state.calsPerDay} calories per day`}
            defaultValue={3000}
            min={0}
            max={5000}
            step={Number(25)}
            value={this.state.calsPerDay}
            onChange={this.updateCalorieState}
            onDragStop={this.updateTargets}
            sliderStyle={{ marginTop: 12, marginBottom: 24 }}
          />
          <Slider
            description={`${this.state.proteinPerDay} g protein per day`}
            defaultValue={100}
            min={0}
            max={200}
            step={Number(5)}
            value={this.state.proteinPerDay}
            onChange={this.updateProteinState}
            onDragStop={this.updateTargets}
            sliderStyle={{ marginTop: 12, marginBottom: 24 }}
          />
        </CardText>
        <CardActions>
          <FlatButton onTouchTap={this.props.openNameDialog} label="Rename Trip" />
          <FlatButton onTouchTap={this.props.removeTrip} label="Delete Trip" />
        </CardActions>
      </Card>
    );
  }
}

TripDetails.propTypes = {
  calsPerDay: PropTypes.number.isRequired,
  proteinPerDay: PropTypes.number.isRequired,
  tripId: PropTypes.string.isRequired,
  numDays: PropTypes.number.isRequired,
  tripName: PropTypes.string.isRequired,
  openNameDialog: PropTypes.func.isRequired,
  removeTrip: PropTypes.func.isRequired,
};
