import React, { Component } from "react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import "./Notifications.scss";
import { PropTypes } from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "react-bootstrap";

class Notification extends Component {
  render() {
    const { children, time } = this.props;

    return (
      <Dropdown.Item>
        <FontAwesomeIcon className="icon" icon={faCircle} size="1x" />
        <div className="notification">
          {children}
          <small>{time}</small>
        </div>
      </Dropdown.Item>
    );
  }
}

Notification.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClick: PropTypes.func,
  time: PropTypes.string,
};

export default Notification;
