import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { router } = this.context;
    Meteor.logout(() => {
      router.push('/');
    });
  }

  renderLoggedIn() {
    const { user } = this.props;
    const email = user.emails[0].address;
    const emailLocalPart = email.substring(0, email.indexOf('@'));

    return (
      <List>
        <Subheader>{emailLocalPart}</Subheader>
        <ListItem primaryText="Log out" onClick={this.handleLogout} />
      </List>
    );
  }

  renderLoggedOut() {
    return (
      <List>
        <ListItem primaryText="Sign in" containerElement={<Link to="/signin" />} />
        <ListItem primaryText="Join" containerElement={<Link to="/join" />} />
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
  user: React.PropTypes.object,
};

UserMenu.contextTypes = {
  router: React.PropTypes.object,
};
