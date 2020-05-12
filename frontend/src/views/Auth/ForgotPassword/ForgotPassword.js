import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "./ForgotPassword.scss";
import Navbar from "../../../core/components/Navbar";
import PocketBox from "../../../core/PocketBox/PocketBox";

class ForgotPassword extends Component {
  render() {
    return (
      <Container fluid id={"forgot-password-page"}>
        <Navbar />
        <Row className="mt-1">
          <Col id={"main"} md={{span: 8, offset: 2}} lg={{span: 4, offset: 3}}>
            <PocketBox iconUrl={"/assets/circle.png"}>
              <h1 className="title">Forgot your password?</h1>
              <p className="text">
                Write your email and we will send you a validation message
              </p>
              <Form id={"main-form"}>
                <Form.Group className="mb-4">
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
            </PocketBox>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ForgotPassword;
