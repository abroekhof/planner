import { Meteor } from 'meteor/meteor';
import React from 'react';

import { Link } from 'react-router';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import AuthPage from './AuthPage.jsx';

export default class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {},
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onSubmit() {
    const errors = {};
    if (!this.state.email) {
      errors.email = 'Email required';
    }
    if (!this.state.password) {
      errors.password = 'Password required';
    }

    this.setState({ errors });

    if (Object.keys(errors).length) {
      return;
    }

    const { router } = this.context;
    const self = this;

    Meteor.loginWithPassword(this.state.email, this.state.password, (err) => {
      if (err) {
        let key;
        if (err.reason === 'User not found') {
          key = 'email';
        }
        if (err.reason === 'Incorrect password') {
          key = 'password';
        }
        self.setState({
          errors: { [key]: err.reason },
        });
        return;
      }
      Meteor.call('trips.updateUserId', () => {
        router.push('/');
      });
    });
  }

  handleChange(event) {
    const nextState = {};
    nextState[event.target.name] = event.target.value;
    this.setState(nextState);
  }

  render() {
    const content = (
      <div>
        <h1>Sign in</h1>
        <p>Signing in allows you to save your trips</p>
        <Link to="/join">Need an account? Join Now.</Link>
        <br />
        {this.state.errors.none}
        <TextField
          onChange={this.handleChange}
          type="email"
          name="email"
          value={this.state.email}
          hintText="Your Email"
          errorText={this.state.errors.email}
        />
        <br />
        <TextField
          onChange={this.handleChange}
          type="password"
          name="password"
          value={this.state.password}
          hintText="Password"
          errorText={this.state.errors.password}
        />
        <br />
        <RaisedButton label="Sign in" onTouchTap={this.onSubmit} primary />
      </div>
    );

    return <AuthPage content={content} />;
  }
}

SignInPage.contextTypes = {
  router: React.PropTypes.object,
};
