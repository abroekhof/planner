import React, { PropTypes } from 'react';

import { Card, CardText } from 'material-ui/Card';

import { Meteor } from 'meteor/meteor';

// a common layout wrapper for auth pages
export default class AuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      googleImg: '/images/btn_google_signin_light_normal_web.png',
    };
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
  }

  loginWithGoogle() {
    const { router } = this.context;
    const self = this;

    Meteor.loginWithGoogle({
      requestPermissions: ['email'],
    }, (err) => {
      if (err) {
        self.setState({
          errors: { email: err.reason },
        });
        return;
      }
      Meteor.call('trips.updateUserId', () => {
        router.push('/');
      });
    });
  }

  render() {
    const { content } = this.props;
    return (
      <Card>
        <CardText>
          {content}
          <br />
          <img
            alt="Sign in with Google"
            style={{ cursor: 'pointer' }}
            onTouchTap={this.loginWithGoogle}
            src={this.state.googleImg}
            onMouseDown={() => (this.setState({ googleImg: '/images/btn_google_signin_light_pressed_web.png' }))}
            onMouseUp={() => (this.setState({ googleImg: '/images/btn_google_signin_light_normal_web.png' }))}
          />
        </CardText>
      </Card>
    );
  }
}

AuthPage.propTypes = {
  content: PropTypes.element,
};

AuthPage.contextTypes = {
  router: React.PropTypes.object,
};
