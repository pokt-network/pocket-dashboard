import React, {Component} from "react";
import {Row} from "react-bootstrap";
import PropTypes from "prop-types";
import LoginStatus from "../LoginStatus/LoginStatus";
import "./AppNavbar.scss";

class AppNavbar extends Component {
  render() {
    // const {helpLink} = this.props;

    return (
      <Row className="app-navbar">
        <div id="main-logo">
          <img src="/assets/logo.svg" alt="logo"/>
          <span className="app-name">
            <span className="logo-divider">/</span>
            DASHBOARD
          </span>
        </div>
        <div className="items">
          {/* TODO: Uncomment when second release*/}
          {/*<div className="buttons">*/}
          {/*  <NotificationIcon/>*/}
          {/*  <HelpLink link={helpLink}/>*/}
          {/*</div>*/}
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
