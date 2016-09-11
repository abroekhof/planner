import React from 'react';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

export default class UserMenu extends React.Component {
  renderLoggedIn() {
    const { user, logout } = this.props;
    const email = user.emails[0].address;
    const emailLocalPart = email.substring(0, email.indexOf('@'));

    return (
      <List>
        <Subheader>{emailLocalPart}</Subheader>
        <ListItem primaryText="Log out" onClick={logout} />
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
  logout: React.PropTypes.func,
};
