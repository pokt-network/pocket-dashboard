import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";

class Navbar extends Component {
  render() {
    const divStyle = {
      width: "255px",
      margin: "28px",
    };

    return (
      <Row>
        <Col id={"navbar"}>
          <img
            src={"/assets/logo-dashboard-color.svg"}
            alt="logo"
            id={"main-logo"}
            style={divStyle}
          />
        </Col>
      </Row>
    );
  }
}

Navbar.defaultProps = {
  helpLink: "#",
};

Navbar.propTypes = {
  helpLink: PropTypes.string,
};

export default Navbar;
