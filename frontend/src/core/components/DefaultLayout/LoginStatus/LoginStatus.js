/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import PropTypes from "prop-types";
import UserService from "../../../services/PocketUserService";
import "./LoginStatus.scss";
import {Redirect} from "react-router-dom";
import {ROUTE_PATHS} from "../../../../_routes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {STYLING} from "../../../../constants";

// eslint-disable-next-line react/display-name
const LabelToggle = React.forwardRef(({children, onClick}, ref) => (
  <a
    id="login-status"
    style={{color: "black"}}
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <p id="username">{children}</p>
    <FontAwesomeIcon
      className="icon"
      icon={faAngleDown}
      color={STYLING.primaryColor}
    />
  </a>
));

LabelToggle.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
};

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
