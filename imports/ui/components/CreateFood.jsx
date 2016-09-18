import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Meteor } from 'meteor/meteor';

export default class FoodDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodName: '',
      calories: '',
      protein: '',
      weight: '',
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.createNewFood = this.createNewFood.bind(this);
  }

  handleTextFieldChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  createNewFood() {
    const { useOz } = this.props;
    let weight = Number(this.state.weight);
    weight = useOz ? weight * 28.3495 : weight;
    Meteor.call('foods.insert',
      this.state.foodName,
      Number(this.state.calories),
      Number(this.state.protein),
      weight
    );
    this.props.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary
        onTouchTap={this.createNewFood}
      />,
    ];
    return (
      <Dialog
        title="Create food"
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.handleClose}
      >
        <TextField
          id="foodName"
          floatingLabelText="Food name"
          value={this.state.foodName}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          id="calories"
          floatingLabelText="Calories"
          value={this.state.calories}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          id="protein"
          floatingLabelText="Protein"
          value={this.state.protein}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          id="weight"
          floatingLabelText={`Weight (${this.props.useOz ? 'ounces' : 'grams'})`}
          value={this.state.weight}
          onChange={this.handleTextFieldChange}
        />
      </Dialog>
    );
  }
}

FoodDrawer.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  useOz: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
};
