import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';
import { Trips } from '../../api/trips.js';
import UserMenu from '../components/UserMenu.jsx';
import TripList from '../components/TripList.jsx';
import FoodList from '../components/FoodList.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showConnectionIssue: false,
    };
    this.logout = this.logout.bind(this);
  }

  componentWillReceiveProps({ loading, children }) {
    // redirect / to a list once lists are ready
    if (!loading && !children) {
      const trip = Trips.findOne();
      this.context.router.replace(`/trips/${trip._id}`);
    }
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
    } = this.props;

    // clone route components with keys so that they can
    // have transitions
    const clonedChildren = children && React.cloneElement(children, {
      key: location.pathname,
    });

    return (
      <MuiThemeProvider>
        <div id="container">
          <section id="left-menu">
            <UserMenu user={user} logout={this.logout} />
            <TripList trips={trips} />
          </section>
          <div id="content-container">
            <ReactCSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              {loading
                ? <span>loading...</span>
                : clonedChildren}
            </ReactCSSTransitionGroup>
          </div>
          <section id="right-menu">
            <FoodList foods={foods} />
          </section>
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
};

App.contextTypes = {
  router: React.PropTypes.object,
};
