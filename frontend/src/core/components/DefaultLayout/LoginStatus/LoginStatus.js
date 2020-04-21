import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import PropTypes from "prop-types";
import UserService from "../../../services/PocketUserService";
import "./LoginStatus.scss";
import {Redirect} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {
  ROUTE_PATHS,
  DASHBOARD_PATHS,
  _getDashboardPath,
} from "../../../../_routes";

// eslint-disable-next-line react/display-name
const LabelToggle = React.forwardRef(({children, onClick}, ref) => (
  <div id="login-status">
    <span className="user-info">
      <p id="info-msg">You are logged in as</p>
      <p id="username">{children}</p>
    </span>
    <span id="down-arrow">
      {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
      <a
        style={{color: "black"}}
        href=""
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        &#x25bc;
      </a>
    </span>
  </div>
));

LabelToggle.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
};

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
    this.setState({loggedOut: true});
  }

  goToProfile() {
    // eslint-disable-next-line react/prop-types
    this.props.history.push(_getDashboardPath(DASHBOARD_PATHS.profile));
  }

  render() {
    const {loggedOut} = this.state;
    const {login} = ROUTE_PATHS;

    if (loggedOut) {
      return <Redirect to={login} />;
    }

    return (
      <Dropdown className="user-dropdown">
        <Dropdown.Toggle as={LabelToggle} id="dropdown-basic">
          {UserService.getUserInfo().name}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => this.logout()}>
            <FontAwesomeIcon className="icon" icon={faCircle} size="1x" />
            User Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.logout()}>
            <FontAwesomeIcon className="icon" icon={faCircle} size="1x" />
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default LoginStatus;
