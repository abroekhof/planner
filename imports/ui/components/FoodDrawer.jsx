import React, { PropTypes, Component } from 'react';
import { Meteor } from 'meteor/meteor';

import { List } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import ContentSort from 'material-ui/svg-icons/content/sort';

import classNames from 'classnames';

import Food from './Food.jsx';
import CreateFood from './CreateFood.jsx';

export default class FoodDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortValue: 'name',
      sortOrder: -1,
      foodFilter: '',
      open: false,
      editingFood: null,
      selectedFoods: [],
    };

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.toggleSortOrder = this.toggleSortOrder.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.editingFood = this.editingFood.bind(this);
    this.addSelectedFood = this.addSelectedFood.bind(this);
    this.removeSelectedFood = this.removeSelectedFood.bind(this);
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

  handleTextFieldChange(event) {
    const copy = Object.assign({}, this.state);
    copy[event.target.id] = event.target.value;
    this.setState(copy);
  }

  toggleSortOrder() {
    const copy = Object.assign({}, this.props.foodSort.get());
    copy.order *= -1;
    this.props.foodSort.set(copy);
    this.setState({ sortOrder: copy.order });
  }

  handleSortChange(event, index, sortValue) {
    const copy = Object.assign({}, this.props.foodSort.get());
    copy.value = sortValue;
    this.props.foodSort.set(copy);
    this.setState({ sortValue });
  }

  addFoods() {
    this.state.selectedFoods.forEach(foodId =>
      Meteor.call('mealFoods.insert',
      foodId,
      this.props.tripId,
      this.props.mealId,
      this.props.dayId,
      1
    )
    );
    this.props.handleCloseDrawer();
    this.clearSelectedFoods();
  }

  addSelectedFood(foodId) {
    this.setState({ selectedFoods: this.state.selectedFoods.concat([foodId]) });
  }

  removeSelectedFood(foodId) {
    this.setState({
      selectedFoods: this.state.selectedFoods.filter(listFoodId => listFoodId !== foodId),
    });
  }

  clearSelectedFoods() {
    this.setState({ selectedFoods: [] });
  }

  renderAddFoodButtom() {
    if (this.props.dayId && this.props.mealId) {
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
    const regex = new RegExp(this.state.foodFilter, 'i');
    const filteredFoods = [];
    const selectedFoods = [];
    this.props.foods.forEach((food) => {
      const selectedIdx = this.state.selectedFoods.indexOf(food._id);
      if (food.name.search(regex) > -1 && selectedIdx === -1) {
        filteredFoods.push(food);
      } else if (selectedIdx > -1) {
        selectedFoods.push(food);
      }
    }
    );

    return (
      <div>
        <CreateFood
          handleClose={this.handleClose}
          handleOpen={this.handleOpen}
          addSelectedFood={this.addSelectedFood}
          open={this.state.open}
          useOz={this.props.useOz}
          editingFood={this.state.editingFood}
        />
        {
          Meteor.user() ?
            <div style={{ padding: '12px' }}>
              <RaisedButton
                fullWidth
                label="Create food"
                onTouchTap={this.handleOpen}
                primary
              />
            </div> : ''
        }
        <Divider />
        <div style={{ padding: '0px 12px 0px 12px' }}>
          <TextField
            id="foodFilter"
            floatingLabelText="Filter foods"
            value={this.state.foodFilter}
            onChange={this.handleTextFieldChange}
            fullWidth
          />
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
                defaultChecked={this.props.foodSort.order === -1}
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
          {selectedFoods.map(food => (
            <Food
              key={food._id}
              food={food}
              checked
              addSelectedFood={this.addSelectedFood}
              removeSelectedFood={this.removeSelectedFood}
              useOz={this.props.useOz}
              editingFood={this.editingFood}
            />
          ))}
          <Divider />
          {filteredFoods.map(food => (
            <Food
              key={food._id}
              food={food}
              checked={false}
              addSelectedFood={this.addSelectedFood}
              removeSelectedFood={this.removeSelectedFood}
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
  foodSort: PropTypes.object.isRequired,
  handleCloseDrawer: PropTypes.func.isRequired,
  useOz: PropTypes.bool.isRequired,
  mealId: PropTypes.string,
  dayId: PropTypes.string,
  tripId: PropTypes.string,
};
