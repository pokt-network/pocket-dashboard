import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import HelpLink from "../../HelpLink";
import PropTypes from "prop-types";
import NotificationIcon from "../../Notification/Notification";
import LoginStatus from "../LoginStatus/LoginStatus";
import "./AppNavbar.scss";

class AppNavbar extends Component {
  render() {
    const {helpLink} = this.props;

    return (
      <Row>
        <Col id={"app-navbar"}>
          <NotificationIcon />
          <HelpLink size={"2x"} link={helpLink} />
          <LoginStatus />
        </Col>
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
