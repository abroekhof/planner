import React, { PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';

import classNames from 'classnames';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import AppBar from 'material-ui/AppBar';
import Snackbar from 'material-ui/Snackbar';
import Toggle from 'material-ui/Toggle';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import Trips from '../../api/trips/trips.js';

import UserMenu from '../components/UserMenu.jsx';
import TripList from '../components/TripList.jsx';
import FoodDrawer from '../components/FoodDrawer.jsx';

const muiTheme = getMuiTheme();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConnectionIssue: false,
      rightOpen: false,
      leftOpen: false,
      useOz: true,
    };
    this.removeTrip = this.removeTrip.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleToggleLeft = this.handleToggleLeft.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenFoodDrawer = this.handleOpenFoodDrawer.bind(this);
    this.toggleUseOz = this.toggleUseOz.bind(this);
  }

  componentWillReceiveProps({ loading, children }) {
    const { router } = this.context;
    // redirect / to a list once lists are ready
    if (!loading && !children) {
      const trip = Trips.findOne();
      if (trip) {
        router.replace(`/trips/${trip._id}`);
      } else {
        Meteor.call('trips.insert', (err, result) => {
          if (err) {
            router.push('/');
          } else {
            router.push(`/trips/${result}`);
          }
        });
      }
    }
  }

  handleToggle() { this.setState({ rightOpen: !this.state.rightOpen }); }
  handleToggleLeft() { this.setState({ leftOpen: !this.state.leftOpen }); }
  handleOpenFoodDrawer(tripId, dayId, mealId) {
    this.setState({ tripId, dayId, mealId });
    this.handleToggle();
  }
  handleClose() { this.setState({ rightOpen: false }); }

  toggleUseOz() {
    this.setState({ useOz: !this.state.useOz });
  }

  removeTrip(id) {
    this.context.router.replace('/');
    Meteor.call('trips.remove', id);
  }

  render() {
    const {
      user,
      loading,
      trips,
      children,
      location,
      foods,
      foodSort,
    } = this.props;

    // clone route components with keys so that they can
    // have transitions
    const clonedChildren = children && React.cloneElement(children, {
      key: location.pathname,
      removeTrip: this.removeTrip,
      handleOpenFoodDrawer: this.handleOpenFoodDrawer,
      location,
      useOz: this.state.useOz,
    });

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar
            title="bear can"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
            onLeftIconButtonTouchTap={this.handleToggleLeft}
          />
          <div>
            <Drawer
              docked={false}
              open={this.state.leftOpen}
              onRequestChange={leftOpen => this.setState({ leftOpen })}
            >
              <UserMenu user={user} handleClose={this.handleToggleLeft} />
              <Divider />
              {user ? <TripList trips={trips} handleClose={this.handleToggleLeft} /> : ''}
              <Divider />
              <List>
                <Subheader>Settings</Subheader>
                <ListItem
                  primaryText="Use US units"
                  rightToggle={
                    <Toggle
                      defaultToggled={this.state.useOz}
                      onToggle={this.toggleUseOz}
                    />
                  }
                />
              </List>
            </Drawer>
            <div className="container-fluid">
              <div className={classNames('row')}>
                <div className={classNames('col-md-offset-3', 'col-md-6', 'col-sm-12', 'col-xs-12')}>
                  <ReactCSSTransitionGroup
                    transitionName="example"
                    transitionEnterTimeout={400}
                    transitionLeaveTimeout={400}
                  >
                    {loading
                      ? <CircularProgress size={2} />
                      : clonedChildren}
                  </ReactCSSTransitionGroup>
                </div>
              </div>
            </div>

            <Drawer
              openSecondary
              docked={false}
              open={this.state.rightOpen}
              onRequestChange={rightOpen => this.setState({ rightOpen })}
              width={400}
            >
              <FoodDrawer
                foods={foods}
                foodSort={foodSort}
                handleCloseDrawer={this.handleClose}
                tripId={this.state.tripId}
                dayId={this.state.dayId}
                mealId={this.state.mealId}
                useOz={this.state.useOz}
              />
            </Drawer>

          </div>
          <Snackbar
            open={this.props.user === null}
            message={"You must be logged in to save trips "}
          />
        </div>

      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  user: PropTypes.object,      // current meteor user
  connected: PropTypes.bool,   // server connection status
  loading: PropTypes.bool,     // subscription status
  menuOpen: PropTypes.bool,    // is side menu open?
  trips: PropTypes.arrayOf(PropTypes.object),      // all lists visible to the current user
  children: PropTypes.element, // matched child route component
  location: PropTypes.object,  // current router location
  params: PropTypes.object,    // parameters of the current route
  foods: PropTypes.arrayOf(PropTypes.object),
  foodSort: PropTypes.object,
};

App.contextTypes = {
  router: PropTypes.object,
};
