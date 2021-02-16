import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useViewport } from "use-viewport";
import "styled-components/macro";
import Login from "views/Dashboard/Onboarding/Login";
import Signup from "views/Dashboard/Onboarding/Signup";
import ForgotPassword from "views/Dashboard/Onboarding/ForgotPassword";

export default function Dashboard() {
  const { path } = useRouteMatch();
  const { within } = useViewport();

  const compactMode = within(-1, "medium");

  return (
    <div
      css={`
        /*
          We wanna enforce a non-scrollable "dashboard" view inside the app,
          so we force the container div to always be height and width of the screen.
          For mobile devices we don't want this restriction, so we only set this rule
          on large screen sizes.
        */
        min-width: 100vw;
        min-height: 100vh;
        /* We also wanna "trap" any absolute elements so that they don't end up behind the div. */
        display: relative;
        ${!compactMode &&
        `
          max-width: 100vw;
          max-height: 100vh;
        `}
      `}
    >
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
    </div>
  );
}
