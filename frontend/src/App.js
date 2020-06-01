import React, {Component} from "react";
// noinspection ES6CheckImport
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import "./App.scss";
import UserService from "./core/services/PocketUserService";
//Pages
import routes, {ROUTE_PATHS} from "./_routes";

class App extends Component {
  render() {
    const isUserLoggedIn = UserService.isLoggedIn();
    const redirectTo =
      isUserLoggedIn && window.location.pathname === "/"
        ? ROUTE_PATHS.home
        : ROUTE_PATHS.login;

    return (
      <BrowserRouter>
        <Switch>
          {routes.map((route, idx) => {
            return (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                component={route.component}
              />
            );
          })}

          <Redirect from="/" to={redirectTo} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
