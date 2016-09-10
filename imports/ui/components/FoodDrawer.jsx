import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { List } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Food from './Food.jsx';
import CreateFood from './CreateFood.jsx';

export default class FoodDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortValue: 'name',
      foodFilter: '',
      open: false,
      selectedFoods: [],
    };

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addSelectedFood = this.addSelectedFood.bind(this);
    this.removeSelectedFood = this.removeSelectedFood.bind(this);
    this.clearSelectedFoods = this.clearSelectedFoods.bind(this);
    this.addFoods = this.addFoods.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false, foodName: '', calories: '', protein: '', weight: '' });
  }

  handleTextFieldChange(event) {
    const copy = Object.assign({}, this.state);
    copy[event.target.id] = event.target.value;
    this.setState(copy);
  }

  handleSortChange(event, index, sortValue) {
    this.props.foodSort.set(
      sortValue
    );
    this.setState({ sortValue });
  }

  addFoods() {
    this.state.selectedFoods.forEach((foodId) =>
      Meteor.call('mealFoods.insert', foodId, this.props.mealId, this.props.dayId, 1)
    );
    this.props.handleCloseDrawer();
    this.clearSelectedFoods();
  }

  addSelectedFood(foodId) {
    this.setState({ selectedFoods: this.state.selectedFoods.concat([foodId]) });
  }

  removeSelectedFood(foodId) {
    const index = this.state.selectedFoods.indexOf(foodId);
    this.setState({ selectedFoods: this.state.selectedFoods.filter((_, i) => i !== index) });
  }

  clearSelectedFoods() {
    this.setState({ selectedFoods: [] });
  }

  renderAddFoodButtom() {
    if (this.props.dayId && this.props.mealId) {
      return (
        <RaisedButton
          label="Add selected foods"
          onTouchTap={this.addFoods}
          primary
          disabled={this.state.selectedFoods.length <= 0}
        />);
    }
    return '';
  }

  render() {
    const regex = new RegExp(this.state.foodFilter, 'i');
    const filteredFoods = this.props.foods.filter((food) =>
       (food.name.search(regex) > -1)
    );

    return (
      <div>
        <CreateFood
          handleClose={this.handleClose}
          handleOpen={this.handleOpen}
          open={this.state.open}
        />
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
        {this.renderAddFoodButtom()}
        <RaisedButton
          label="Clear selection"
          onTouchTap={this.clearSelectedFoods}
          disabled={this.state.selectedFoods <= 0}
        />
        <List>
        {filteredFoods.map((food) => (
          <Food
            key={food._id}
            food={food}
            checked={this.state.selectedFoods.indexOf(food._id) !== -1}
            addSelectedFood={this.addSelectedFood}
            removeSelectedFood={this.removeSelectedFood}
          />
        ))}
        </List>
      </div>
    );
  }
}

FoodDrawer.propTypes = {
  foods: PropTypes.array.isRequired,
  foodSort: PropTypes.object.isRequired,
  handleCloseDrawer: PropTypes.func.isRequired,
  mealId: PropTypes.string,
  dayId: PropTypes.string,
};