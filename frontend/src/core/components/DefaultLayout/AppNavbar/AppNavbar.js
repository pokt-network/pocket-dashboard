import React, {Component} from "react";
import {Row} from "react-bootstrap";
import PropTypes from "prop-types";
import LoginStatus from "../LoginStatus/LoginStatus";
import "./AppNavbar.scss";

class AppNavbar extends Component {
  render() {
    // const {helpLink} = this.props;

    return (
      <Row className="app-navbar" noGutters>
        <div id="main-logo">
          <a
            rel="noopener noreferrer"
            style={{marginLeft: "0px", cursor: "pointer"}}
            href={`${window.location.origin}/dashboard`}
          >
            <img src="/assets/logo-dashboard-color.svg" alt="logo" />
          </a>
        </div>
        <div className="items">
          {/* TODO: Uncomment when second release*/}
          {/*<div className="buttons">*/}
          {/*  <NotificationIcon/>*/}
          {/*  <HelpLink link={helpLink}/>*/}
          {/*</div>*/}
          <LoginStatus />
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
