import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { List } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import Food from './Food.jsx';

export default class FoodList extends Component {
  constructor(props) {
    super(props);

    this.state = { foodName: '', calories: '', protein: '', weight: '' };

    this.createNewFood = this.createNewFood.bind(this);
    this._handleTextFieldChange = this._handleTextFieldChange.bind(this);
  }

  _handleTextFieldChange(event) {
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

  renderForm() {
    return (
      <form id="search" className="new-food" onSubmit={this.createNewFood} >
        <TextField
          id="foodName"
          floatingLabelText="Food name"
          value={this.state.foodName}
          onChange={this._handleTextFieldChange}
        />
        <TextField
          id="calories"
          floatingLabelText="Calories"
          value={this.state.calories}
          onChange={this._handleTextFieldChange}
        />
        <TextField
          id="protein"
          floatingLabelText="Protein"
          value={this.state.protein}
          onChange={this._handleTextFieldChange}
        />
        <TextField
          id="weight"
          floatingLabelText="Weight"
          value={this.state.weight}
          onChange={this._handleTextFieldChange}
        />
        <RaisedButton label="Create food" onClick={this.createNewFood} primary />
      </form>);
  }

  render() {
    return (
      <div>
        {this.renderForm()}
        <Divider />
        <List>
        {this.props.foods.map((food) => (
          <Food key={food._id} food={food} />
        ))}
        </List>
      </div>
    );
  }
}

FoodList.propTypes = {
  foods: PropTypes.array.isRequired,
};
