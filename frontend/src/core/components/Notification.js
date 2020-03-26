import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell} from "@fortawesome/free-solid-svg-icons";

class NotificationIcon extends Component {
  // TODO: Add functionality to display notifications

  render() {
    return <FontAwesomeIcon size="2x" icon={faBell} />;
  }
}

export default NotificationIcon;
