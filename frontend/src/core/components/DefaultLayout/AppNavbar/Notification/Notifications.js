import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Dropdown } from "react-bootstrap";
import Notification from "./Notification";
import "./Notifications.scss";

// eslint-disable-next-line react/display-name
const NotificationToggle = React.forwardRef(({ children, onClick }, ref) => (
  <div
    style={{ cursor: "pointer" }}
    className="notifications"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <img src="/assets/bell-notification.svg" alt="bell-notification" />
    <span className="badge badge-secondary">{children}</span>
  </div>
));

NotificationToggle.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
};

class NotificationIcon extends Component {
  // TODO: Add functionality to connect to backend and display data

  render() {
    return (
      <Dropdown alignRight id="dropdown-menu-align-right">
        <Dropdown.Toggle as={NotificationToggle} id="dropdown-basic">
          2
        </Dropdown.Toggle>

        <Dropdown.Menu className="notifications">
          <Notification time="1 hour ago">
            <p>Your app APP_NAME is in the staking process</p>
          </Notification>
          <Notification time="1 hour ago">
            <p>Your app APP_NAME is in the staking process</p>
          </Notification>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default NotificationIcon;
