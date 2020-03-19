import React, {Component} from "react";
import PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";

export default class Sidebar extends Component {
  render() {
    const {children} = this.props;

    return (
      <Col xs={2} sm={3} lg={3} id={"sidebar"}>
        <Row>
          <img src={"/logo.png"} alt="logo" id={"main-logo"}/>
        </Row>
        {children}
      </Col>
    );
  }
}

Sidebar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};
