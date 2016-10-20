import React, { PropTypes } from 'react';

import { Meteor } from 'meteor/meteor';
import { analytics } from 'meteor/okgrow:analytics';

import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.renderLoggedOut = this.renderLoggedOut.bind(this);
  }

  handleLogout() {
    analytics.track('Logged out', { user: this.props.user });
    this.props.handleClose();
    const { router } = this.context;
    Meteor.logout(() => {
      router.push('/');
    });
  }

  loginWithGoogle() {
    const { router } = this.context;
    const self = this;

    Meteor.loginWithGoogle({
      requestPermissions: ['email'],
    }, (err) => {
      if (err) { return; }
      analytics.track('Logged in with Google');
      Meteor.call('trips.updateUserId', () => {
        router.push('/');
      });
    });
  }

  renderLoggedOut() {
    return (
      <List>
        <ListItem
          primaryText="Sign in with Google"
          onTouchTap={this.loginWithGoogle}
          leftAvatar={<Avatar src="images/google-large.png" />}
        />
      </List>
    );
  }

  renderLoggedIn() {
    const { user } = this.props;
    const email = user.emails[0].address;
    const emailLocalPart = email.substring(0, email.indexOf('@'));
    let userItem;
    if (user.profile.picture) {
      userItem = (
        <ListItem
          disabled
          primaryText={emailLocalPart}
          leftAvatar={<Avatar src={user.profile.picture} />}
        />
      );
    } else {
      userItem = (
        <ListItem
          disabled
          primaryText={emailLocalPart}
        />
      );
    }
    return (
      <List>
        {userItem}
        <ListItem primaryText="Log out" onClick={this.handleLogout} />
      </List>
    );
  }

  render() {
    return this.props.user
      ? this.renderLoggedIn()
      : this.renderLoggedOut();
  }
}

UserMenu.propTypes = {
  user: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};

UserMenu.contextTypes = {
  router: PropTypes.object,
};
