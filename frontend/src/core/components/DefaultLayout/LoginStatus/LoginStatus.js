/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import UserService from "../../../services/PocketUserService";
import "./LoginStatus.scss";
import { Redirect, withRouter } from "react-router-dom";
import {
  _getDashboardPath,
  DASHBOARD_PATHS,
  ROUTE_PATHS,
} from "../../../../_routes";
import LabelToggle from "../../LabelToggle";

class LoginStatus extends Component {
  constructor(props, context) {
    super(props, context);

    this.logout = this.logout.bind(this);
    this.goToProfile = this.goToProfile.bind(this);

    this.state = {
      loggedOut: false,
    };
  }

  logout() {
    UserService.logout();
    this.setState({ loggedOut: true });
  }

  goToProfile() {
    // eslint-disable-next-line react/prop-types
    this.props.history.push(_getDashboardPath(DASHBOARD_PATHS.profile));
  }

  render() {
    const { loggedOut } = this.state;
    const { login } = ROUTE_PATHS;

    if (loggedOut) {
      return <Redirect to={login} />;
    }

    return (
      <Dropdown className="user-dropdown">
        <Dropdown.Toggle as={LabelToggle} id="dropdown-basic">
          {UserService.getUserInfo().name}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => this.goToProfile()}>
            <img
              src={"/assets/user_icon_circle.svg"}
              className="icon"
              alt="user-profile-icon"
            />
            User Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.logout()}>
            <img
              src={"/assets/log-out.svg"}
              className="icon"
              alt="logout-profile-icon"
            />
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default withRouter(LoginStatus);
