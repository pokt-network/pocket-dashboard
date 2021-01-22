import React, {Component} from "react";
import {Button, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import LoginStatus from "../LoginStatus/LoginStatus";
import "./AppNavbar.scss";

class AppNavbar extends Component {
  render() {
    // const {helpLink} = this.props;

    return (
      <Row className="app-navbar" noGutters>
        <div id="main-logo" style={{display: "inline-flex"}}>
          <img src="/assets/logo-dashboard-color.svg" alt="logo" useMap="#workmap"/>
          <Button
            variant="dark" style={{marginLeft: "40px", marginTop: "20px"}}>
            <a target="_blank" href="https://pokt.network/dashboard-beta-version-sugestion-box/" rel="noopener noreferrer" style={{color:"#FFFFFF"}}>
              BETA
              </a>
          </Button>
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
