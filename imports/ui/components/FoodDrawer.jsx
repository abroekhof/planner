import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { List } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';

import Food from './Food.jsx';

export default class FoodDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodName: '',
      calories: '',
      protein: '',
      weight: '',
      sortValue: 'name',
      foodFilter: '',
      open: false,
    };

    this.createNewFood = this.createNewFood.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleTextFieldChange(event) {
    const copy = Object.assign({}, this.state);
    copy[event.target.id] = event.target.value;
    this.setState(copy);
  }

  createNewFood() {
    Meteor.call('foods.insert',
      this.state.foodName,
      Number(this.state.calories),
      Number(this.state.protein),
      Number(this.state.weight));

    this.setState({ foodName: '', calories: '', protein: '', weight: '' });
  }

  handleSortChange(event, index, sortValue) {
    this.props.foodSort.set(
      sortValue
    );
    this.setState({ sortValue });
  }

  render() {
    const regex = new RegExp(this.state.foodFilter, 'i');
    const filteredFoods = this.props.foods.filter((food) =>
       (food.name.search(regex) > -1)
    );

    const actions = [
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        onTouchTap={this.createNewFood}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Rename trip"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
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
            floatingLabelText="Weight"
            value={this.state.weight}
            onChange={this.handleTextFieldChange}
          />
        </Dialog>
        <RaisedButton label="Create food" onTouchTap={this.handleOpen} primary />
        <Divider />
        <TextField
          id="foodFilter"
          floatingLabelText="Filter foods"
          value={this.state.foodFilter}
          onChange={this.handleTextFieldChange}
        />
        <SelectField
          value={this.state.sortValue}
          onChange={this.handleSortChange}
          floatingLabelText="Sort by"
        >
          <MenuItem value={'name'} primaryText="Name" />
          <MenuItem value={'calories'} primaryText="Calories" />
          <MenuItem value={'protein'} primaryText="Protein" />
          <MenuItem value={'weight'} primaryText="Weight" />
        </SelectField>
        <List>
        {filteredFoods.map((food) => (
          <Food key={food._id} food={food} />
        ))}
        </List>
      </div>
    );
  }
}

FoodDrawer.propTypes = {
  foods: PropTypes.array.isRequired,
  foodSort: PropTypes.object.isRequired,
};
