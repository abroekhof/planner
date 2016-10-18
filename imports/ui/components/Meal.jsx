import React, { PropTypes, Component } from 'react';

import { List, ListItem } from 'material-ui/List';
import AddCircle from 'material-ui/svg-icons/content/add-circle';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';

import MealFood from './MealFood.jsx';

import { totals, convertWeight } from '../helpers';

class Meal extends Component {

  constructor(props) {
    super(props);
    this.handleOpenFoodDrawer = this.handleOpenFoodDrawer.bind(this);
    this.renderMealFoods = this.renderMealFoods.bind(this);
  }

  handleOpenFoodDrawer() {
    this.props.handleOpenFoodDrawer(this.props.tripId, this.props.dayId, this.props.meal.id);
  }

  renderMealFoods() {
    const { useOz } = this.props;
    return this.props.mealFoods.map(mealFood => (
      <MealFood key={mealFood._id} useOz={useOz} mealFood={mealFood} />
    ));
  }

  render() {
    const { mealFoods, useOz, meal } = this.props;
    const mealTotals = totals(mealFoods);
    return (
      <Paper>
        <List>
          <Subheader>
            {meal.name} (
            {mealTotals.calories} calories
            , {mealTotals.protein} g protein, {convertWeight(mealTotals.weight, useOz)})
          </Subheader>
          {this.renderMealFoods()}
          <ListItem
            primaryText={`Add food to ${meal.name}`}
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
  tripId: PropTypes.string.isRequired,
  dayId: PropTypes.string.isRequired,
  mealFoods: PropTypes.array.isRequired,
  useOz: PropTypes.bool.isRequired,
  handleOpenFoodDrawer: PropTypes.func.isRequired,
};

export default Meal;
