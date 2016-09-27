import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Meteor } from 'meteor/meteor';

import { isNumeric } from '../helpers.js';

const gPerOz = 28.3495;

export default class FoodDrawer extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      foodName: '',
      calories: '',
      protein: '',
      weight: '',
      errors: {},
    };
    this.state = this.initialState;
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.createNewFood = this.createNewFood.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { editingFood } = nextProps;
    if (editingFood) {
      this.setState({
        foodName: editingFood.name,
        calories: editingFood.calories,
        protein: editingFood.protein,
        // display ounces if needed
        weight: nextProps.useOz ? editingFood.weight / gPerOz : editingFood.weight,
      });
    }
  }

  handleTextFieldChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  createNewFood() {
    const state = this.state;
    const errors = {};
    if (!state.foodName) {
      errors.foodName = 'Name required';
    }
    const values = ['calories', 'protein', 'weight'];
    values.forEach((value) => {
      if (!state[value]) {
        errors[value] = `${value} required`;
      } else if (!isNumeric(state[value])) {
        errors[value] = `${value} must be a number`;
      }
    });

    this.setState({ errors });
    // if there are any errors, return
    if (Object.keys(errors).length) {
      return;
    }

    const { useOz } = this.props;
    let weight = Number(this.state.weight);
    // convert oz to grams
    weight = useOz ? weight * gPerOz : weight;

    const args = [
      this.state.foodName,
      Number(this.state.calories),
      Number(this.state.protein),
      weight,
    ];

    Meteor.apply('foods.verify', args, (error, verified) => {
      if (!verified) {
        Meteor.apply('foods.insert', args);
      }
    });
    this.handleClose();
  }

  handleClose() {
    // reset text field values
    this.setState(this.initialState);
    this.props.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary
        onTouchTap={this.createNewFood}
      />,
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <Dialog
        title="Create food"
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose}
      >
        <TextField
          id="foodName"
          floatingLabelText="Food name"
          value={this.state.foodName}
          onChange={this.handleTextFieldChange}
          errorText={this.state.errors.foodName}
        />
        <TextField
          id="calories"
          floatingLabelText="Calories"
          value={this.state.calories}
          onChange={this.handleTextFieldChange}
          errorText={this.state.errors.calories}
        />
        <TextField
          id="protein"
          floatingLabelText="Protein"
          value={this.state.protein}
          onChange={this.handleTextFieldChange}
          errorText={this.state.errors.protein}
        />
        <TextField
          id="weight"
          floatingLabelText={`Weight (${this.props.useOz ? 'ounces' : 'grams'})`}
          value={this.state.weight}
          onChange={this.handleTextFieldChange}
          errorText={this.state.errors.weight}
        />
      </Dialog>
    );
  }
}

FoodDrawer.propTypes = {
  handleClose: PropTypes.func.isRequired,
  useOz: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
};
