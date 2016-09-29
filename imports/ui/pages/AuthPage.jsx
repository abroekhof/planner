import React, { PropTypes } from 'react';

import { Card, CardText } from 'material-ui/Card';

// a common layout wrapper for auth pages
const AuthPage = ({ content, link }) => (
  <Card>
    <CardText>
      {content}
      {link}
    </CardText>
  </Card>
);

AuthPage.propTypes = {
  content: PropTypes.element,
  link: PropTypes.element,
};

export default AuthPage;
