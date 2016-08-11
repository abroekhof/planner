import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from '../../ui/containers/AppContainer.js';
import TripPageContainer from '../../ui/containers/TripPageContainer.js';
import AuthPageSignIn from '../../ui/pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../../ui/pages/AuthPageJoin.jsx';
import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="trips/:tripId" component={TripPageContainer} />
      <Route path="signin" component={AuthPageSignIn} />
      <Route path="join" component={AuthPageJoin} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);
