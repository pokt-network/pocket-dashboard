import React, {Component} from "react";
// noinspection ES6CheckImport
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import "./App.scss";
//Pages
import Login from "./views/Core/Login";

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login}/>

          <Redirect from="/" to="/login"/>
        </Switch>
      </HashRouter>
    );
  }
}


export default App;
