import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "views/Dashboard/Onboarding/Login";
import Signup from "views/Dashboard/Onboarding/Signup";
import ForgotPassword from "views/Dashboard/Onboarding/ForgotPassword";

export default function Dashboard() {
  return (
    <Switch>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/forgotpassword">
        <ForgotPassword />
      </Route>
      <Route exact path="/">
        <Login />
      </Route>
      <Route exact path="/apps/setup">
        <Login />
      </Route>
      <Route exact path="/apps/:appid">
        <Login />
      </Route>
    </Switch>
  );
}
