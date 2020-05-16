import React, {Component} from "react";
import {Row} from "react-bootstrap";
import HelpLink from "../../HelpLink";
import PropTypes from "prop-types";
import NotificationIcon from "./Notification/Notifications";
import LoginStatus from "../LoginStatus/LoginStatus";
import "./AppNavbar.scss";

class AppNavbar extends Component {
  render() {
    const {helpLink} = this.props;

    return (
      <Row id={"app-navbar"}>
        <div id={"main-logo"}>
          <img src={"/logo.png"} alt="logo"/>
          <span className={"logo-divider"}>/</span>
          <span className={"app-name"}>DASHBOARD</span>
        </div>
        <div className="items">
          <NotificationIcon/>
          <HelpLink link={helpLink}/>
          <LoginStatus/>
        </div>
      </Row>
    );
  }
}

AppNavbar.defaultProps = {
  helpLink: "#",
};

AppNavbar.propTypes = {
  helpLink: PropTypes.string,
};

export default AppNavbar;
