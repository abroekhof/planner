import React, { PropTypes, Component } from 'react';
import Meal from './Meal.jsx';
import Resupply from './Resupply.jsx';

import Chip from 'material-ui/Chip';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Paper from 'material-ui/Paper';

import { Meteor } from 'meteor/meteor';

const styles = {
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

class Day extends Component {
  constructor(props) {
    super(props);
    this.handleRemoveDay = this.handleRemoveDay.bind(this);
  }

  handleRemoveDay() {
    Meteor.call('days.remove', this.props.day._id);
  }

  renderMeals() {
    const { meals, mealFoods, foods, day, resupplyWeight } = this.props;
    let idx = 0;
    const out = meals.map((meal) => {
      const mf = mealFoods.filter(
        (mealFood) => (mealFood.mealId === meal._id));
      const f = mealFoods.map(
        (mealFood) => (foods.filter(
          (food) => (food._id === mealFood.foodId))[0]));
      const div = (
        <div key={meal._id}>
          <Resupply day={day} idx={idx} weight={resupplyWeight} />
          <Meal
            meal={meal}
            mealFoods={mf}
            foods={f}
            dayId={day._id}
          />
        </div>
      );
      idx++;
      return div;
    });
    out.push(<Resupply key={idx} day={day} idx={idx} />);
    return out;
  }

  render() {
    const { dayTotals, weightLeft, idx } = this.props;
    return (
      <Paper>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarTitle text={`Day ${idx}`} />
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarTitle text={`Day ${idx}`} />
          </ToolbarGroup>
          <ToolbarGroup lastChild>
            <IconMenu
              iconButtonElement={
                <IconButton><MoreVertIcon /></IconButton>
              }
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem onClick={this.handleRemoveDay} primaryText="Delete" />
            </IconMenu>
          </ToolbarGroup>
        </Toolbar>

        <div style={styles.wrapper}>
          <Chip style={styles.chip}>{dayTotals.calories} calories</Chip>
          <Chip style={styles.chip}>{dayTotals.protein} g protein</Chip>
          <Chip style={styles.chip}>{weightLeft} oz. to carry</Chip>
        </div>
        <ul>
          {this.renderMeals()}
        </ul>
      </Paper>
  );
  }
}

Day.propTypes = {
  day: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  meals: PropTypes.array.isRequired,
  mealFoods: PropTypes.array.isRequired,
  foods: PropTypes.array.isRequired,
  weightLeft: PropTypes.number.isRequired,
  resupplyWeight: PropTypes.number,
  dayTotals: PropTypes.object.isRequired,
};

export default Day;
