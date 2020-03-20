import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import HelpLink from "./HelpLink";

class Navbar extends Component {
  render() {
    const { helpLink } = this.props;

    return (
      <Row>
        <Col id={"navbar"}>
          <img src={"/logo.png"} alt="logo" id={"main-logo"} />

          <HelpLink link={helpLink || "#"} />
        </Col>
      </Row>
    );
  }
}

export default Navbar;
