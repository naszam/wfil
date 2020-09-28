import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Wallet from './pages/Wallet';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/wallet" exact component={Wallet} />
        <Route component={Home} />
      </Switch>
    </Router>
  );
}
 
export default Routes;