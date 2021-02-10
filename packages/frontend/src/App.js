import React, { Component } from "react";
// noinspection ES6CheckImport
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import UserService from "./core/services/PocketUserService";
import { MobileView, BrowserView } from "react-device-detect";
//Pages
import routes, { ROUTE_PATHS } from "./_routes";

class App extends Component {
  render() {
    const isUserLoggedIn = UserService.isLoggedIn();
    const redirectTo =
      isUserLoggedIn && window.location.pathname === "/"
        ? ROUTE_PATHS.home
        : ROUTE_PATHS.login;

    return (
      <>
        <MobileView>
          <div className="app-mobile">
            <center>
              <div className="vertical-center">
                <img src="/assets/no-mobile.svg" alt="" className="indicator" />
                <p className="title">
                  Your Screen is <br /> too small
                </p>
                <p className="sub-title">
                  Please acceess the
                  <br /> Pocket Dashboard from a <br /> desktop device.{" "}
                </p>
              </div>
            </center>
          </div>
          <img
            src="/assets/preview.svg"
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
        </MobileView>
        <BrowserView>
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
        </BrowserView>
      </>
    );
  }
}

export default App;
