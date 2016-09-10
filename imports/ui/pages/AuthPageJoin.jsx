import React from 'react';

import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import AuthPage from './AuthPage.jsx';

export default class JoinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirm: '',
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
    if (this.state.confirm !== this.state.password) {
      errors.confirm = 'Please confirm your password';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Accounts.createUser({
      email: this.state.email,
      password: this.state.password,
    }, err => {
      if (err) {
        console.log(err);
        this.setState({
          errors: { none: err.reason },
        });
      }
      this.context.router.push('/');
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
        <h1>Join</h1>
        <p>Joining allows you to save your trips</p>
        <TextField
          onChange={this.handleChange}
          type="email"
          name="email"
          value={this.state.email}
          hintText="Your Email"
          errorText={this.state.errors.email}
        />
        <TextField
          onChange={this.handleChange}
          type="password"
          name="password"
          value={this.state.password}
          hintText="Password"
          errorText={this.state.errors.password}
        />
        <TextField
          onChange={this.handleChange}
          type="password"
          name="confirm"
          value={this.state.confirm}
          hintText="Confirm Password"
          errorText={this.state.errors.confirm}
          disabled={this.state.password.length <= 0}
        />
        <br />
        <RaisedButton label="Create account" onTouchTap={this.onSubmit} primary />
      </div>
    );

    const link = <Link to="/signin">Have an account? Sign in</Link>;

    return <AuthPage content={content} link={link} />;
  }
}

JoinPage.contextTypes = {
  router: React.PropTypes.object,
};
