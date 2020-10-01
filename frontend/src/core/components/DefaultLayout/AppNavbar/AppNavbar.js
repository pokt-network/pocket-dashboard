import React, {Component} from "react";
import {Button, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import LoginStatus from "../LoginStatus/LoginStatus";
import "./AppNavbar.scss";

class AppNavbar extends Component {
  render() {
    // const {helpLink} = this.props;

    return (
      <Row className="app-navbar" noGutters>
        <map name="workmap">
          <area target="_blank" shape="rect" coords="0,11,115,65" alt="Pocket" href="https://pokt.network" />
          <area shape="rect" coords="120,14,225,65" alt="Dashboard" href={`${window.location.origin}/dashboard`} />
        </map>
        <div id="main-logo" style={{display: "inline-flex"}}>
          <img src="/assets/logo-dashboard-color.svg" alt="logo" useMap="#workmap"/>
          <Button
            variant="dark" style={{marginLeft: "40px", marginTop: "20px"}}>
            <Link target="_blank" to="https://pokt.network/dashboard-beta-version-sugestion-box/" style={{color:"#FFFFFF"}}>
              BETA
              </Link>
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
