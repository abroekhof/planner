import React, { PropTypes, Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { analytics } from 'meteor/okgrow:analytics';

import { List } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import ContentSort from 'material-ui/svg-icons/content/sort';

import classNames from 'classnames';

import Food from './Food.jsx';
import CreateFood from './CreateFood.jsx';
import FoodSearch from './FoodSearch.jsx';

export default class FoodDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortValue: 'name',
      sortOrder: -1,
      open: false,
      editingFood: null,
      selectedFoods: [],
    };

    this.handleSortChange = this.handleSortChange.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.editingFood = this.editingFood.bind(this);
    this.selectFood = this.selectFood.bind(this);
    this.unselectFood = this.unselectFood.bind(this);
    this.clearSelectedFoods = this.clearSelectedFoods.bind(this);
    this.addFoods = this.addFoods.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    // close the dialog and clear the food being edited
    this.setState({ open: false, editingFood: null });
  }

  editingFood(f) {
    this.setState({ editingFood: f });
    this.handleOpen();
  }

  toggleSortOrder() {
    const copy = Object.assign({}, this.props.foodOpts.get());
    copy.sort[this.state.sortValue] *= -1;
    this.props.foodOpts.set(copy);
    this.setState({ sortOrder: copy.sort[this.state.sortValue] });
  }

  handleSortChange(event, index, sortValue) {
    const copy = Object.assign({}, this.props.foodOpts.get());
    copy.sort = {};
    copy.sort[sortValue] = this.state.sortOrder;
    this.props.foodOpts.set(copy);
    this.setState({ sortValue });
  }

  addFoods() {
    this.state.selectedFoods.forEach((food) => {
      Meteor.call(
        'mealFoods.insert',
        food._id,
        this.props.tripId,
        this.props.mealId,
        this.props.dayId,
        1
      );
      analytics.track('Added MealFood', {
        userId: this.userId,
        foodName: food.name,
        tripId: this.props.tripId,
        mealId: this.props.mealId,
        dayId: this.props.dayId,
      });
    });


    this.props.handleCloseDrawer();
    this.clearSelectedFoods();
  }

  selectFood(food) {
    this.setState({ selectedFoods: this.state.selectedFoods.concat([food]) });
  }

  unselectFood(foodId) {
    this.setState({
      selectedFoods: this.state.selectedFoods.filter(listFood => listFood._id !== foodId),
    });
  }

  clearSelectedFoods() {
    this.setState({ selectedFoods: [] });
  }

  renderAddFoodButtom() {
    if (!!this.props.dayId && {}.hasOwnProperty.call(this.props, 'mealId')) {
      return (
        <RaisedButton
          label="Add selected foods"
          style={{ width: '50%' }}
          onTouchTap={this.addFoods}
          primary
          disabled={this.state.selectedFoods.length <= 0}
        />);
    }
    return '';
  }

  render() {
    const unselectedFoods = this.props.foods.filter(
      food => !this.state.selectedFoods.includes(food)
    );
    return (
      <div>
        <CreateFood
          handleClose={this.handleClose}
          handleOpen={this.handleOpen}
          selectFood={this.selectFood}
          open={this.state.open}
          useOz={this.props.useOz}
          editingFood={this.state.editingFood}
        />
        {

          <div style={{ padding: '12px' }}>
            {
              Meteor.user() ?
                <RaisedButton
                  fullWidth
                  label="Create food"
                  onTouchTap={this.handleOpen}
                  primary
                /> : <RaisedButton
                  fullWidth
                  label="Log in to create foods!"
                  disabled
                  primary
                />
              }
          </div>
        }
        <Divider />
        <div style={{ padding: '0px 12px 0px 12px' }}>
          <FoodSearch searchString={this.props.searchString} />
          <div className={classNames('row', 'middle-xs')}>
            <div className={classNames('col-xs-10')}>
              <SelectField
                value={this.state.sortValue}
                onChange={this.handleSortChange}
                floatingLabelText="Sort by"
                fullWidth
              >
                <MenuItem value={'name'} primaryText="Name" />
                <MenuItem value={'calories'} primaryText="Calories" />
                <MenuItem value={'caloriesPerWeight'} primaryText={`Calories per ${this.props.useOz ? 'oz' : '100 g'}`} />
                <MenuItem value={'protein'} primaryText="Protein" />
                <MenuItem value={'proteinPerWeight'} primaryText={`Protein per ${this.props.useOz ? 'oz' : '100 g'}`} />
                <MenuItem value={'weight'} primaryText="Weight" />
              </SelectField>
            </div>
            <div className={classNames('col-xs-2')}>
              <Checkbox
                checkedIcon={<ContentSort />}
                uncheckedIcon={<ContentSort />}
                defaultChecked={this.state.sortOrder === -1}
                onCheck={this.toggleSortOrder}
                style={{ justifyContent: 'center' }}
              />
            </div>
          </div>
          {this.renderAddFoodButtom()}
          <RaisedButton
            label="Clear selection"
            style={{ width: '50%' }}
            onTouchTap={this.clearSelectedFoods}
            disabled={this.state.selectedFoods <= 0}
          />
        </div>
        <List>
          {this.state.selectedFoods.map(food => (
            <Food
              key={food._id}
              food={food}
              checked
              selectFood={this.selectFood}
              unselectFood={this.unselectFood}
              useOz={this.props.useOz}
              editingFood={this.editingFood}
            />
          ))}
          <Divider />
          {unselectedFoods.map(food => (
            <Food
              key={food._id}
              food={food}
              checked={false}
              selectFood={this.selectFood}
              unselectFood={this.unselectFood}
              useOz={this.props.useOz}
              editingFood={this.editingFood}
            />
          ))}
        </List>
      </div>
    );
  }
}

FoodDrawer.propTypes = {
  foods: PropTypes.arrayOf(PropTypes.object).isRequired,
  foodOpts: PropTypes.object.isRequired,
  searchString: PropTypes.object.isRequired,
  handleCloseDrawer: PropTypes.func.isRequired,
  useOz: PropTypes.bool.isRequired,
  mealId: PropTypes.number,
  dayId: PropTypes.string,
  tripId: PropTypes.string,
};
