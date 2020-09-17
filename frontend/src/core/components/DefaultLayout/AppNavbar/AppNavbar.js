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
        <map name="workmap">
          <area target="_blank" shape="rect" coords="0,11,115,65" alt="Pocket" href="http://www.pokt.network" />
          <area shape="rect" coords="120,14,225,65" alt="Dashboard" href={`${window.location.origin}/dashboard`} />
        </map>
        <div id="main-logo">
          <img src="/assets/logo-dashboard-color.svg" alt="logo" usemap="#workmap"/>
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
