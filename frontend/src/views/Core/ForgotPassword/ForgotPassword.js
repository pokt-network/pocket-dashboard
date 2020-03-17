import React, { Component } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import "./ForgotPassword.scss";

class ForgotPassword extends Component {
  render() {
    return (
      <Container fluid id={"forgot-password-page"}>
        <Row>
          <Col id={"navbar"}>
            <img src={"/logo.png"} alt="logo" id={"main-logo"} />

            <div className={"help"}>
              <Button variant={"link"}>
                <FontAwesomeIcon icon={faQuestionCircle} />
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col
            id={"main"}
            md={{ span: 8, offset: 2 }}
            lg={{ span: 4, offset: 4 }}
          >
            <h1>Forgot your password?</h1>
            <p>Write your email and we will send you a validation message</p>
            <Form id={"main-form"}>
              <Form.Group>
                <Form.Label>E-mail</Form.Label>
                <Form.Control type="email" />
              </Form.Group>
              <Button type="submit" variant="dark" size={"lg"} block>
                Send email
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ForgotPassword;
