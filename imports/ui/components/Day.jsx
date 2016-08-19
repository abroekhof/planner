import React, { PropTypes, Component } from 'react';
import Meal from './Meal.jsx';
import Resupply from './Resupply.jsx';

import Chip from 'material-ui/Chip';
import { Card, CardText, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { green100, red100 } from 'material-ui/styles/colors';

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
    const { dayTotals, weightLeft, idx, calsPerDay, proteinPerDay } = this.props;
    return (
      <Card>
        <CardTitle title={`Day ${idx}`}>
          <div style={styles.wrapper}>
            <Chip
              style={styles.chip}
              backgroundColor={(dayTotals.calories > calsPerDay) ? green100 : red100}
            >
              {dayTotals.calories} calories
            </Chip>
            <Chip
              style={styles.chip}
              backgroundColor={(dayTotals.protein >= proteinPerDay) ? green100 : red100}
            >
              {dayTotals.protein} g protein
            </Chip>
            <Chip style={styles.chip}>{weightLeft} oz. to carry</Chip>
          </div>
        </CardTitle>

        <CardText>
          <ul>
            {this.renderMeals()}
          </ul>
        </CardText>
        <CardActions>
          <FlatButton label="Remove day" onClick={this.handleRemoveDay} />
        </CardActions>
      </Card>
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
  calsPerDay: PropTypes.number.isRequired,
  proteinPerDay: PropTypes.number.isRequired,
};

export default Day;
