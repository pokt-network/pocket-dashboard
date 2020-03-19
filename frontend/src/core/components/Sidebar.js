import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";

class Sidebar extends Component {
  render() {
    const { children } = this.props;

    return (
      <Col xs={2} sm={3} lg={3} id={"sidebar"}>
        <Row>
          <img src={"/logo.png"} alt="logo" id={"main-logo"} />
        </Row>
        {children}
      </Col>
    );
  }
}

export default Sidebar;
