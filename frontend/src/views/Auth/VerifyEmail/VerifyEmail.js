import React, { Component } from "react";
import PropTypes from "prop-types";
import "./VerifyEmail.scss";
import { Button, Col, Container, Row } from "react-bootstrap";
import Navbar from "../../../core/components/Navbar";

class VerifyEmail extends Component {
  // TODO: Integrate with backend
  state = {
    email: ""
  };

  render() {
    return (
      <Container fluid id="verify-email-page">
        <Navbar />
        <Row>
          <Col
            id="main"
            md={{ span: 8, offset: 2 }}
            lg={{ span: 4, offset: 4 }}
          >
            <h1>
              We send an email to this address <br />
              ******23@gmail.com
            </h1>
            <p>You did not receive it?</p>
            <Button variant="dark" size={"lg"} block>
              Resend
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

VerifyEmail.propTypes = {
  email: PropTypes.string
};

export default VerifyEmail;
