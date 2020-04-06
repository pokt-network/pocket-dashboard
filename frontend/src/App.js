import React, {Component} from "react";
// noinspection ES6CheckImport
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import "./App.scss";
//Pages
import routes, {ROUTE_PATHS} from "./_routes";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          {
            routes.map((route, idx) => {
              return <Route key={idx} path={route.path} exact={route.exact} name={route.name}
                            component={route.component}/>;
            })
          }

          <Redirect from="/" to={ROUTE_PATHS.login}/>
        </Switch>
      </BrowserRouter>
    );
  }
}


export default App;
