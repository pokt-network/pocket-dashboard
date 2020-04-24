/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import UserService from "../../../services/PocketUserService";
import "./LoginStatus.scss";
import {Redirect} from "react-router-dom";
import {ROUTE_PATHS} from "../../../../_routes";
import LabelToggle from "../../LabelToggle/LabelToggle";

class LoginStatus extends Component {
  constructor(props, context) {
    super(props, context);

    this.logout = this.logout.bind(this);

    this.state = {
      loggedOut: false,
    };
  }

  logout() {
    UserService.logout();
    this.setState({loggedOut: true});
  }

  render() {
    const {loggedOut} = this.state;
    const {login} = ROUTE_PATHS;

    if (loggedOut) {
      return <Redirect to={login} />;
    }

    return (
      <Dropdown>
        <Dropdown.Toggle as={LabelToggle} id="dropdown-basic">
          {UserService.getUserInfo().name}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => this.logout()}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default LoginStatus;
