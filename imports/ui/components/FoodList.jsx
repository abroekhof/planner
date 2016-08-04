import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';

import Food from './Food.jsx';

export default class FoodList extends Component {
  constructor(props) {
    super(props);

    this.createNewFood = this.createNewFood.bind(this);
  }

  createNewFood(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const name = ReactDOM.findDOMNode(this.refs.foodName).value.trim();
    const calories = ReactDOM.findDOMNode(this.refs.calories).value.trim();
    const protein = ReactDOM.findDOMNode(this.refs.protein).value.trim();
    const weight = ReactDOM.findDOMNode(this.refs.weight).value.trim();

    Meteor.call('foods.insert',
      name,
      Number(calories),
      Number(protein),
      Number(weight));

    // Clear form
    ReactDOM.findDOMNode(this.refs.foodName).value = '';
    ReactDOM.findDOMNode(this.refs.calories).value = '';
    ReactDOM.findDOMNode(this.refs.protein).value = '';
    ReactDOM.findDOMNode(this.refs.weight).value = '';
  }
  renderForm() {
    return (
      <form id="search" className="new-food" onSubmit={this.createNewFood} >
        <input
          type="text"
          ref="foodName"
          autoComplete="off"
          placeholder="Food"
        />
        <input
          type="text"
          ref="calories"
          autoComplete="off"
          placeholder="Number of calories"
        />
        <input
          type="text"
          ref="protein"
          autoComplete="off"
          placeholder="Protein in grams"
        />
        <input
          type="text"
          ref="weight"
          autoComplete="off"
          placeholder="Weight in ounces"
        />
        <input
          type="submit"
        />
      </form>);
  }

  render() {
    return (
      <div className="list-foods">
        {this.renderForm()}
        {this.props.foods.map((food) => (
          <Food key={food._id} food={food} />
        ))}
      </div>
    );
  }
}

FoodList.propTypes = {
  foods: PropTypes.array.isRequired,
};
