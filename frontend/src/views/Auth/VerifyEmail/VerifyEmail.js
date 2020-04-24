import React, {Component} from "react";
import PropTypes from "prop-types";
import "./VerifyEmail.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import Navbar from "../../../core/components/Navbar";
import PocketUserService from "../../../core/services/PocketUserService";
import AppSteps from "../../../core/components/AppSteps/AppSteps";

class VerifyEmail extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      email: "justaname94@outlook.com",
    };
  }

  componentDidMount() {
    // TODO Obtain email from backend
  }

  render() {
    const {email} = this.state;

    return (
      <Container fluid id="verify-email-page">
        <Navbar />
        <Row className="mb-3">
          <Col lg={{span: 6, offset: 3}}>
            <AppSteps
              steps={[
                "Account Created",
                "Email Verified",
                "Security Questions",
              ]}
              current={0}
            />
          </Col>
        </Row>
        <Row></Row>
        <Row>
          <Col id="main" md={{span: 8, offset: 2}} lg={{span: 4, offset: 4}}>
            <h1>
              We send an email to this address <br />
              {PocketUserService.formatEmail(email)}
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
  email: PropTypes.string,
};

export default VerifyEmail;
