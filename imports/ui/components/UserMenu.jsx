import React from 'react';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';

export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.stopPropagation();
    this.setState({
      open: !this.state.open,
    });
  }

  renderLoggedIn() {
    const { open } = this.state;
    const { user, logout } = this.props;
    const email = user.emails[0].address;
    const emailLocalPart = email.substring(0, email.indexOf('@'));

    return (
      <div className="user-menu vertical">
        <a href="#" className="btn-secondary" onClick={this.toggle}>
          {open
            ? <span className="icon-arrow-up"></span>
            : <span className="icon-arrow-down"></span>}
          {emailLocalPart}
        </a>
        {open
          ? <a className="btn-secondary" onClick={logout}>Logout</a>
          : null}
      </div>
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
