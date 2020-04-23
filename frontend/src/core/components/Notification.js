import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-regular-svg-icons";
import {STYLING} from "../../constants";

class NotificationIcon extends Component {
  // TODO: Add functionality to display notifications

  render() {
    return (
      <FontAwesomeIcon size="2x" color={STYLING.primaryColor} icon={faBell} />
    );
  }
}

export default NotificationIcon;
