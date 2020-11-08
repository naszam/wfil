import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route component={Home} />
      </Switch>
    </Router>
  );
}
 
export default Routes;