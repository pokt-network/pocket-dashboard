import React, {Component} from "react";
import PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";

export default class Sidebar extends Component {
  render() {
    const {children, xs, sm, lg} = this.props;

    return (
      <Col xs={xs} sm={sm} lg={lg} id={"sidebar"}>
        <Row>
          <img src={"/logo.png"} alt="logo" id={"main-logo"} />
        </Row>
        {children}
      </Col>
    );
  }
}

Sidebar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  xs: PropTypes.number,
  sm: PropTypes.number,
  lg: PropTypes.number,
};
