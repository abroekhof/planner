import React, { PropTypes, Component } from 'react';

import { Meteor } from 'meteor/meteor';
import { analytics } from 'meteor/okgrow:analytics';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { Card, CardHeader, CardText } from 'material-ui/Card';

import classNames from 'classnames';

import { isNumeric, gPerOz } from '../helpers';

export default class FoodDrawer extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      foodName: '',
      servingsPerContainer: '',
      weight: '',
      calories: '',
      caloriesFromFat: '',
      totalFat: '',
      saturatedFat: '',
      cholesterol: '',
      sodium: '',
      potassium: '',
      totalCarbohydrate: '',
      dietaryFiber: '',
      sugars: '',
      protein: '',
      errors: {},
    };
    this.state = this.initialState;
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.createNewFood = this.createNewFood.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { editingFood } = nextProps;
    if (editingFood) {
      this.setState({
        foodName: editingFood.name,
        servingsPerContainer: editingFood.servingsPerContainer,
        calories: editingFood.calories,
        protein: editingFood.protein,
        // display ounces if needed
        weight: nextProps.useOz ? editingFood.weight / gPerOz : editingFood.weight,
        caloriesFromFat: editingFood.caloriesFromFat,
        totalFat: editingFood.totalFat,
        saturatedFat: editingFood.saturatedFat,
        cholesterol: editingFood.cholesterol,
        sodium: editingFood.sodium,
        potassium: editingFood.potassium,
        totalCarbohydrate: editingFood.totalCarbohydrate,
        dietaryFiber: editingFood.dietaryFiber,
        sugars: editingFood.sugars,
      });
    }
  }

  handleTextFieldChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  createNewFood() {
    const state = this.state;
    const errors = {};
    if (!state.foodName) {
      errors.foodName = 'Name required';
    }
    const values = [
      'servingsPerContainer',
      'weight',
      'calories',
      'caloriesFromFat',
      'totalFat',
      'saturatedFat',
      'cholesterol',
      'sodium',
      'potassium',
      'totalCarbohydrate',
      'dietaryFiber',
      'sugars',
      'protein',
    ];
    values.forEach((value) => {
      if (!state[value]) {
        errors[value] = 'required';
      } else if (!isNumeric(state[value])) {
        errors[value] = 'must be a number';
      }
    });

    this.setState({ errors });
    // if there are any errors, return
    if (Object.keys(errors).length) {
      return;
    }

    const { useOz } = this.props;
    let weight = Number(this.state.weight);
    // Convert oz to grams
    // Change the weight to per serving, because that's what's used throughout the app
    weight = (useOz ? weight * gPerOz : weight) / state.servingsPerContainer;

    const editingFoodId = this.props.editingFood ? this.props.editingFood._id : null;
    const args = [
      editingFoodId,
      state.foodName,
      Number(state.servingsPerContainer),
      Number(state.calories),
      Number(state.caloriesFromFat),
      Number(state.totalFat),
      Number(state.saturatedFat),
      Number(state.cholesterol),
      Number(state.sodium),
      Number(state.potassium),
      Number(state.totalCarbohydrate),
      Number(state.dietaryFiber),
      Number(state.sugars),
      Number(state.protein),
      weight,
    ];
    const { selectFood } = this.props;
    Meteor.apply('foods.verify', args, (error, food) => {
      if (editingFoodId) {
        analytics.track('Edited food', { args });
      } else {
        analytics.track('Created food', { args });
      }
      selectFood(food);
    });


    this.handleClose();
  }

  handleClose() {
    // reset text field values
    this.setState(this.initialState);
    this.props.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary
        onTouchTap={this.createNewFood}
      />,
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <Dialog
        title="Create food"
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
      >
        <Card style={{ marginTop: '8px' }}>
          <CardHeader
            title="Instructions"
            actAsExpander
            showExpandableButton
          />
          <CardText expandable>
            <p>
              All fields are required. If a value is not on the Nutrition Label, just use 0. If
              you do not have a Nutrition Label, try Googling the food!
            </p>
            <p>
              The foods you create are visible only to you, until someone else creates the same
              food, at which point it is &lsquo;verified&rsquo; and publicly useable. Create
              accurate foods to help the community!
            </p>
            <p>
              You can update or delete a food you create until it is verified. Updating a food may
              also cause it to be verified!
            </p>
            <p>
              If you find an error with a verified food, get in touch
              at <a href="mailto:feedback@bearcan.io">feedback@bearcan.io</a>
            </p>
          </CardText>
        </Card>
        <div className={classNames('container-fluid', 'create-food')}>
          <div className="row">
            <div className="col-md-12">
              <TextField
                id="foodName"
                floatingLabelText="Food name"
                value={this.state.foodName}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.foodName}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <TextField
                id="servingsPerContainer"
                floatingLabelText="Servings Per Container"
                value={this.state.servingsPerContainer}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.servingsPerContainer}
              />
            </div>
            <div className="col-md-6">
              <TextField
                id="weight"
                floatingLabelText={`Container weight (${this.props.useOz ? 'ounces' : 'grams'})`}
                value={this.state.weight}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.weight}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <TextField
                id="calories"
                floatingLabelText="Calories"
                value={this.state.calories}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.calories}
              />
            </div>
            <div className="col-md-6">
              <TextField
                id="caloriesFromFat"
                floatingLabelText="Calories from fat"
                value={this.state.caloriesFromFat}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.caloriesFromFat}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <TextField
                id="totalFat"
                floatingLabelText="Total fat (g)"
                value={this.state.totalFat}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.totalFat}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-1 col-md-11">
              <TextField
                id="saturatedFat"
                floatingLabelText="Saturated fat (g)"
                value={this.state.saturatedFat}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.saturatedFat}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <TextField
                id="cholesterol"
                floatingLabelText="Cholesterol (mg)"
                value={this.state.cholesterol}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.cholesterol}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <TextField
                id="sodium"
                floatingLabelText="Sodium (mg)"
                value={this.state.sodium}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.sodium}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <TextField
                id="potassium"
                floatingLabelText="Potassium (mg)"
                value={this.state.potassium}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.potassium}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <TextField
                id="totalCarbohydrate"
                floatingLabelText="Total Carbohydrate (g)"
                value={this.state.totalCarbohydrate}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.totalCarbohydrate}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-1 col-md-11">
              <TextField
                id="dietaryFiber"
                floatingLabelText="Dietary Fiber (g)"
                value={this.state.dietaryFiber}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.dietaryFiber}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-offset-1 col-md-11">
              <TextField
                id="sugars"
                floatingLabelText="Sugars (g)"
                value={this.state.sugars}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.sugars}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <TextField
                id="protein"
                floatingLabelText="Protein (g)"
                value={this.state.protein}
                onChange={this.handleTextFieldChange}
                errorText={this.state.errors.protein}
              />
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

FoodDrawer.propTypes = {
  handleClose: PropTypes.func.isRequired,
  selectFood: PropTypes.func.isRequired,
  useOz: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  editingFood: PropTypes.object,
};
