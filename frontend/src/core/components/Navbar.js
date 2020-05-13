import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";

class Navbar extends Component {
  render() {
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
