import React, { Component } from "react";
import PropTypes from "prop-types";
import "./VerifyEmail.scss";
import { Button, Col, Container, Row } from "react-bootstrap";
import Navbar from "../../../core/components/Navbar";

class VerifyEmail extends Component {
  state = {
    email: ""
  };

  componentDidMount() {
    // TODO Obtain email from backend
  }

  render() {
    const { email } = this.state;

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
              { email }
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
