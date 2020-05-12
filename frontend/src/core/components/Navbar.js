import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import HelpLink from "./HelpLink";
import PropTypes from "prop-types";

class Navbar extends Component {
  render() {
    const {helpLink} = this.props;

    return (
      <Row>
        <Col id={"navbar"}>
          <img src={"/logo.png"} alt="logo" id={"main-logo"}/>
        </Col>
      </Row>
    );
  }
}

Navbar.defaultProps = {
  helpLink: "#"
};

Navbar.propTypes = {
  helpLink: PropTypes.string
};

export default Navbar;
