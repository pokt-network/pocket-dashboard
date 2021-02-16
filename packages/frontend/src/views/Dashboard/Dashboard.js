import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Login from "views/Dashboard/Onboarding/Login";
import Signup from "views/Dashboard/Onboarding/Signup";
import ForgotPassword from "views/Dashboard/Onboarding/ForgotPassword";

export default function Dashboard() {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/`}>
        <Login />
      </Route>
      <Route exact path={`${path}/signup`}>
        <Signup />
      </Route>
      <Route exact path={`${path}/login`}>
        <Login />
      </Route>
      <Route exact path={`${path}/forgotpassword`}>
        <ForgotPassword />
      </Route>
      <Route exact path={`${path}/home`}>
        <Login />
      </Route>
      <Route exact path={`${path}/apps/setup`}>
        <Login />
      </Route>
      <Route exact path={`$${path}/apps/:appId`}>
        <Login />
      </Route>
    </Switch>
  );
}
