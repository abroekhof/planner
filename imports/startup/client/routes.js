import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from '../../ui/containers/AppContainer.js';
import TripPageContainer from '../../ui/containers/TripPageContainer.js';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="trips/:tripId" component={TripPageContainer} />
    </Route>
  </Router>
);
