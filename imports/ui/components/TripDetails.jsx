import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { Card, CardText, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

export default class TripDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calsPerDay: props.calsPerDay,
      proteinPerDay: props.proteinPerDay,
      open: false,
      tripName: props.tripName,
    };
    this.updateCalorieState = this.updateCalorieState.bind(this);
    this.updateProteinState = this.updateProteinState.bind(this);
    this.updateTargets = this.updateTargets.bind(this);
    this.updateTripName = this.updateTripName.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleTextFieldChange(e) {
    this.setState({ tripName: e.target.value });
  }

  updateTripName() {
    if (this.state.tripName !== '') {
      Meteor.call('trips.updateName',
      this.props.tripId,
      this.state.tripName);
    } else {
      this.setState({ tripName: this.props.tripName });
    }
    this.handleClose();
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
    const actions = [
      <FlatButton
        label="Ok"
        primary
        onTouchTap={this.updateTripName}
      />,
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <Card style={{ marginTop: '8px', marginBottom: '8px' }}>
        <Dialog
          title="Rename trip"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            hintText="New name"
            autoFocus
            onChange={this.handleTextFieldChange}
          />
        </Dialog>
        <CardTitle
          title={this.props.tripName}
          subtitle={`${this.props.numDays} ${dayNoun}`}
        />
        <CardText>
          <span>{`${this.state.calsPerDay} calories per day`}</span>
          <Slider
            defaultValue={3000}
            min={0}
            max={5000}
            step={Number(25)}
            value={this.state.calsPerDay}
            onChange={this.updateCalorieState}
            onDragStop={this.updateTargets}
            sliderStyle={{ marginTop: 12, marginBottom: 24 }}
          />
          <span>{`${this.state.proteinPerDay} g protein per day`}</span>
          <Slider
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
          <FlatButton onTouchTap={this.handleOpen} label="Rename Trip" />
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
  removeTrip: PropTypes.func.isRequired,
};
