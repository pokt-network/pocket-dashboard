import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "./ForgotPassword.scss";
import Navbar from "../../../core/components/Navbar";

class ForgotPassword extends Component {
  render() {
    return (
      <Container fluid id={"forgot-password-page"}>
        <Navbar />
        <Row>
          <Col id={"main"} md={{span: 8, offset: 2}} lg={{span: 4, offset: 3}}>
            <div className="head"></div>
            <div className="wrapper">
              <h1 className="text-uppercase">Forgot your password?</h1>
              <p className="font-weight-light">
                Write your email and we will send you a validation message
              </p>
              <Form id={"main-form"}>
                <Form.Group>
                  <Form.Label id="email-label">Email Address</Form.Label>
                  <Form.Control type="email" />
                </Form.Group>
                <Button
                  className="pt-2 pb-2 pl-5 pr-5"
                  type="submit"
                  variant="primary"
                  size={"md"}
                >
                  Reset password
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ForgotPassword;
