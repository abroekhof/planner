import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { List } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';

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
    };

    this.createNewFood = this.createNewFood.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
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

  renderForm() {
    return (
      <Paper>
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
        <RaisedButton label="Create food" onClick={this.createNewFood} primary />
      </Paper>
    );
  }

  render() {
    const regex = new RegExp(this.state.foodFilter, 'i');
    const filteredFoods = this.props.foods.filter((food) =>
       (food.name.search(regex) > -1)
    );

    return (
      <div>
        {this.renderForm()}
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
