import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import Chip from 'material-ui/Chip';
import { Card, CardText, CardTitle, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { green100, red100 } from 'material-ui/styles/colors';

import Meal from './Meal.jsx';
import Resupply from './Resupply.jsx';
import { convertWeight } from '../helpers';
import { meals } from '../../api/meals/meals';

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
    this.handleDuplicateDay = this.handleDuplicateDay.bind(this);
  }

  handleRemoveDay() {
    Meteor.call('days.remove', this.props.day._id);
  }

  handleDuplicateDay() {
    Meteor.call('days.duplicate', this.props.day._id);
  }

  renderMeals() {
    const {
      mealFoods,
      tripId,
      day,
      resupplyWeight,
      handleOpenFoodDrawer,
      useOz } = this.props;
    let idx = 0;
    const out = meals.map((meal, mealIdx) => {
      const mf = mealFoods.filter(mealFood => (mealFood.mealId === mealIdx));
      const div = (
        <div key={mealIdx}>
          {!(idx === 0 && this.props.idx === 0) ?
            <Resupply day={day} idx={idx} weight={resupplyWeight} useOz={useOz} /> : ''}
          <Meal
            meal={meal}
            mealFoods={mf}
            tripId={tripId}
            dayId={day._id}
            handleOpenFoodDrawer={handleOpenFoodDrawer}
            useOz={useOz}
          />
        </div>
      );
      idx += 1;
      return div;
    });
    out.push(<Resupply key={idx} day={day} idx={idx} weight={resupplyWeight} useOz={useOz} />);
    return out;
  }

  render() {
    const { dayTotals, weightLeft, idx, calsPerDay, proteinPerDay, useOz } = this.props;
    return (
      <Card style={{ 'margin-bottom': '8px' }}>
        <CardTitle style={{ padding: '16px 16px 0 16px' }} title={`Day ${idx + 1}`}>
          <div style={styles.wrapper}>
            <Chip
              style={styles.chip}
              backgroundColor={(dayTotals.calories >= calsPerDay) ? green100 : red100}
            >
              {dayTotals.calories} calories
            </Chip>
            <Chip
              style={styles.chip}
              backgroundColor={(dayTotals.protein >= proteinPerDay) ? green100 : red100}
            >
              {dayTotals.protein} g protein
            </Chip>
            <Chip style={styles.chip}>{convertWeight(weightLeft, useOz)} to carry</Chip>
          </div>
        </CardTitle>

        <CardText>
          {this.renderMeals()}
        </CardText>

        <CardActions>
          <FlatButton label="Remove day" onClick={this.handleRemoveDay} />
          <FlatButton label="Duplicate day" onClick={this.handleDuplicateDay} />
        </CardActions>
      </Card>
    );
  }
}

Day.propTypes = {
  tripId: PropTypes.string.isRequired,
  day: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  mealFoods: PropTypes.arrayOf(PropTypes.object).isRequired,
  weightLeft: PropTypes.number.isRequired,
  resupplyWeight: PropTypes.number,
  useOz: PropTypes.bool.isRequired,
  dayTotals: PropTypes.object.isRequired,
  calsPerDay: PropTypes.number.isRequired,
  proteinPerDay: PropTypes.number.isRequired,
  handleOpenFoodDrawer: PropTypes.func.isRequired,
};

export default Day;
