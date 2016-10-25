/* eslint-env browser  */
import React, { PropTypes, Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { analytics } from 'meteor/okgrow:analytics';

import { List, ListItem } from 'material-ui/List';
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
import FoodListContainer from '../containers/FoodListContainer';

export default class FoodDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foodOpts: { sort: { name: 1 }, limit: 50 },
      searchString: '',
      open: false,
      editingFood: null,
      selectedFoods: [],
      loading: false,
    };

    this.handleSortChange = this.handleSortChange.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.editingFood = this.editingFood.bind(this);
    this.selectFood = this.selectFood.bind(this);
    this.unselectFood = this.unselectFood.bind(this);
    this.clearSelectedFoods = this.clearSelectedFoods.bind(this);
    this.addFoods = this.addFoods.bind(this);
    this.increaseLimit = this.increaseLimit.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ loading: false });
  }

  toggleSortOrder() {
    const foodOpts = Object.assign({}, this.state.foodOpts);
    _.each(_.keys(foodOpts.sort), key => (foodOpts.sort[key] *= -1));
    foodOpts.limit = 50;
    console.log(foodOpts);
    this.setState({ foodOpts });
  }

  handleSortChange(event, index, sortValue) {
    const foodOpts = Object.assign({}, this.state.foodOpts);
    foodOpts.sort = {};
    foodOpts.sort[sortValue] = _.values(this.state.foodOpts.sort)[0];
    foodOpts.limit = 50;
    this.setState({ foodOpts });
  }

  handleSearch(searchString) {
    this.setState({ searchString });
  }

  increaseLimit() {
    const foodOpts = Object.assign({}, this.state.foodOpts);
    foodOpts.limit += 50;
    this.setState({ foodOpts });
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

  renderAddFoodButton() {
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
          <FoodSearch handleSearch={this.handleSearch} />
          <div className={classNames('row', 'middle-xs')}>
            <div className={classNames('col-xs-10')}>
              <SelectField
                value={_.keys(this.state.foodOpts.sort)[0]}
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
                onCheck={this.toggleSortOrder}
                style={{ justifyContent: 'center' }}
              />
            </div>
          </div>
          {this.renderAddFoodButton()}
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
              defaultChecked
              selectFood={this.selectFood}
              unselectFood={this.unselectFood}
              useOz={this.props.useOz}
              editingFood={this.editingFood}
            />
          ))}
          <Divider />
        </List>
        <FoodListContainer
          params={{
            foodOpts: this.state.foodOpts,
            searchString: this.state.searchString,
            selectFood: this.selectFood,
            unselectFood: this.unselectFood,
            useOz: this.props.useOz,
            editingFood: this.editingFood,
          }}
        />
        <ListItem onTouchTap={this.increaseLimit} primaryText="Load more foods" />
      </div>
    );
  }
}

FoodDrawer.propTypes = {
  handleCloseDrawer: PropTypes.func.isRequired,
  useOz: PropTypes.bool.isRequired,
  mealId: PropTypes.number,
  dayId: PropTypes.string,
  tripId: PropTypes.string,
};
