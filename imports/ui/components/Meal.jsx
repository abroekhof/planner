import React, { PropTypes, Component } from 'react';

import { List } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import MealFood from './MealFood.jsx';

import { totals } from '../helpers.js';


class Meal extends Component {

  constructor(props) {
    super(props);
    this.handleOpenDrawer = this.handleOpenDrawer.bind(this);
  }

  handleOpenDrawer() {
    this.props.handleOpenDrawer(this.props.dayId, this.props.meal._id);
  }

  renderMealFoods() {
    return this.props.mealFoods.map((mealFood) => (
      <MealFood key={mealFood._id} mealFood={mealFood} />
    ));
  }

  render() {
    const { mealFoods } = this.props;
    const mealTotals = totals(mealFoods);
    return (
      <div>
        <h3>{this.props.meal.name}</h3>
         ({mealTotals.calories} calories)
        <RaisedButton
          label={`Add food to ${this.props.meal.name}`}
          onTouchTap={this.handleOpenDrawer}
        />
        <List>
        {(mealFoods.length === 0) ? <li>Drag a food here!</li> : this.renderMealFoods()}
        </List>
      </div>
    );
  }
}

Meal.propTypes = {
  meal: PropTypes.object.isRequired,
  dayId: PropTypes.string.isRequired,
  mealFoods: PropTypes.array.isRequired,
  handleOpenDrawer: PropTypes.func.isRequired,
};

export default Meal;
