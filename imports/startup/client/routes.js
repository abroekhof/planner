import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from '../../ui/containers/AppContainer';
import TripPageContainer from '../../ui/containers/TripPageContainer';
import NotFoundPage from '../../ui/pages/NotFoundPage.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="trips/:tripId" component={TripPageContainer} />
      <Route path="*" component={NotFoundPage} />
    </Route>
  </Router>
);
