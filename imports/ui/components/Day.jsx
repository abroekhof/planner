import React, { PropTypes, Component } from 'react';
import Meal from './Meal.jsx';
import Resupply from './Resupply.jsx';

import { Meteor } from 'meteor/meteor';

class Day extends Component {
  constructor(props) {
    super(props);
    this.handleRemoveDay = this.handleRemoveDay.bind(this);
  }

  handleRemoveDay() {
    Meteor.call('days.remove', this.props.day._id);
  }

  renderMeals() {
    const { meals, mealFoods, foods, day } = this.props;
    let idx = 0;
    const out = meals.map((meal) => {
      const mf = mealFoods.filter(
        (mealFood) => (mealFood.mealId === meal._id));
      const f = mealFoods.map(
        (mealFood) => (foods.filter(
          (food) => (food._id === mealFood.foodId))[0]));
      const div = (
        <div>
          <Resupply key={idx} day={day} idx={idx} />
          <Meal
            key={meal._id}
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
      <div>
        <h2>Day {idx}</h2>
        <button className="btn-primary" onClick={this.handleRemoveDay}>Remove day</button>
        <span>{dayTotals.calories} calories</span>
        <span>{weightLeft} oz. to carry</span>
        <ul>
          {this.renderMeals()}
        </ul>
      </div>
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
  dayTotals: PropTypes.object.isRequired,
};

export default Day;
