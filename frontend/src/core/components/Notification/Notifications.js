import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";
import "./Notifications.scss";
import {PropTypes} from "prop-types";
import {Dropdown} from "react-bootstrap";
import Notification from "./Notification";

// eslint-disable-next-line react/display-name
const NotificationToggle = React.forwardRef(({children, onClick}, ref) => (
  <span
    style={{cursor: "pointer"}}
    className="notifications"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <span className="badge badge-secondary">{children}</span>
    <FontAwesomeIcon size="2x" icon={faBell} />
  </span>
));

NotificationToggle.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
};

class NotificationIcon extends Component {
  // TODO: Add functionality to connect to backend and display data

  render() {
    return (
      <Dropdown
        alignRight
        className="user-dropdown"
        id="dropdown-menu-align-right"
      >
        <Dropdown.Toggle as={NotificationToggle} id="dropdown-basic">
          2
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Notification time="1 hour ago">
            <p>Your app APP_NAME is in the unbonding process</p>
          </Notification>
          <Notification time="1 hour ago">
            <p>Your app APP_NAME is in the unbonding process</p>
          </Notification>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default NotificationIcon;
