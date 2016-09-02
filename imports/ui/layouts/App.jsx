import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';

import { Trips } from '../../api/trips.js';

import UserMenu from '../components/UserMenu.jsx';
import TripList from '../components/TripList.jsx';
import FoodDrawer from '../components/FoodDrawer.jsx';


const styles = {
  container: {
    marginLeft: 256,

  },
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConnectionIssue: false,
      open: false,
    };
    this.logout = this.logout.bind(this);
    this.removeTrip = this.removeTrip.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenDrawer = this.handleOpenDrawer.bind(this);
  }

  componentWillReceiveProps({ loading, children }) {
    // redirect / to a list once lists are ready
    if (!loading && !children) {
      const trip = Trips.findOne();
      this.context.router.replace(`/trips/${trip._id}`);
    }
  }

  handleToggle() { this.setState({ open: !this.state.open }); }
  handleOpenDrawer(dayId, mealId) {
    this.setState({ dayId, mealId });
    this.handleToggle();
  }
  handleClose() { this.setState({ open: false }); }

  removeTrip(id) {
    const trip = Trips.findOne({ _id: { $ne: id } });
    this.context.router.replace(`/trips/${trip._id}`);
    Meteor.call('trips.remove', id);
  }

  logout() {
    Meteor.logout();
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
      handleOpenDrawer: this.handleOpenDrawer,
    });

    return (
      <MuiThemeProvider>
        <div id="container">

          <Drawer docked>
            <UserMenu user={user} logout={this.logout} />
            <Divider />
            <TripList trips={trips} />
          </Drawer>

          <div style={styles.container} id="content-container">
            <ReactCSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={400}
              transitionLeaveTimeout={400}
            >
              {loading
                ? <CircularProgress size={2} />
                : clonedChildren}
            </ReactCSSTransitionGroup>
          </div>

          <Drawer
            openSecondary
            docked={false}
            open={this.state.open}
            onRequestChange={(open) => this.setState({ open })}
          >
            <FoodDrawer
              foods={foods}
              foodSort={foodSort}
              handleCloseDrawer={this.handleClose}
              dayId={this.state.dayId}
              mealId={this.state.mealId}
            />
          </Drawer>

        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object,      // current meteor user
  connected: React.PropTypes.bool,   // server connection status
  loading: React.PropTypes.bool,     // subscription status
  menuOpen: React.PropTypes.bool,    // is side menu open?
  trips: React.PropTypes.array,      // all lists visible to the current user
  children: React.PropTypes.element, // matched child route component
  location: React.PropTypes.object,  // current router location
  params: React.PropTypes.object,    // parameters of the current route
  foods: React.PropTypes.array,
  foodSort: React.PropTypes.object,
};

App.contextTypes = {
  router: React.PropTypes.object,
};
