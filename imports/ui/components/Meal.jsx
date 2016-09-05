import React, { PropTypes, Component } from 'react';

import { List, ListItem } from 'material-ui/List';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';

import MealFood from './MealFood.jsx';

import totals from '../helpers.js';


class Meal extends Component {

  constructor(props) {
    super(props);
    this.handleOpenFoodDrawer = this.handleOpenFoodDrawer.bind(this);
  }

  handleOpenFoodDrawer() {
    this.props.handleOpenFoodDrawer(this.props.dayId, this.props.meal._id);
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
      <Paper>
        <List>
          <Subheader>
            {this.props.meal.name} (
            {mealTotals.calories} calories, {mealTotals.protein} g protein, {mealTotals.weight} oz.)
          </Subheader>
          {this.renderMealFoods()}
          <ListItem
            primaryText={`Add food to ${this.props.meal.name}`}
            leftIcon={<AddCircle />}
            onTouchTap={this.handleOpenFoodDrawer}
          />
        </List>
      </Paper>
    );
  }
}

Meal.propTypes = {
  meal: PropTypes.object.isRequired,
  dayId: PropTypes.string.isRequired,
  mealFoods: PropTypes.array.isRequired,
  handleOpenFoodDrawer: PropTypes.func.isRequired,
};

export default Meal;
