import React, { lazy } from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { AppWrapper } from "ui";
import Home from "views/Home/Home";

/* 
 As we don't want to load the whole app when the user gets to the landing page as it'd be a waste of space, we're code splitting the app itself by
 hiding the remaining routes behind another component that will actually
 load everything else. This way he only needs to download the bundles he's actually using,
 and will improve load times.
 *
 */
const Dashboard = lazy(() => import("views/Dashboard/Dashboard"));

function App() {
  return (
    <AppWrapper>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </AppWrapper>
  );
}

export default App;
