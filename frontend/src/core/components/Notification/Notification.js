import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faBell} from "@fortawesome/free-solid-svg-icons";
import "./Notification.scss";
import {PropTypes} from "prop-types";
import {Dropdown} from "react-bootstrap";

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
          100
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => this.logout()}>
            <FontAwesomeIcon className="icon" icon={faCircle} size="1x" />
            <div className="notification">
              <p>Your app APP_NAME is in the unbonding process</p>
              <small>1 hour ago</small>
            </div>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.logout()}>
            <FontAwesomeIcon className="icon" icon={faCircle} size="1x" />
            <div className="notification">
              <p>Your app APP_NAME is in the unbonding process</p>
              <small>1 hour ago</small>
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default NotificationIcon;
