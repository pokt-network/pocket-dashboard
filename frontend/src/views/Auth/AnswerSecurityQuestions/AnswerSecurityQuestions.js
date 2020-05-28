import React, { Component } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./AnswerSecurityQuestions.scss";
import Navbar from "../../../core/components/Navbar";
import PocketBox from "../../../core/components/PocketBox/PocketBox";
import UserService from "../../../core/services/PocketUserService";

class AnswerSecurityQuestions extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data: {
        email: "",
      },
    };
  }

  handleChange({ currentTarget: input }) {
    const data = { ...this.state.data };

    data[input.name] = input.value;
    this.setState({ data });
  }

  handleSubmit(e) {
    e.preventDefault();

    // TODO: call backend method to reset password.
  }

  render() {
    return (
      <Container fluid id={"answer-security-questions-page"}>
        <Navbar />
        <Row className="mt-1">
          <Col
            id={"main"}
            md={{ span: 8, offset: 2 }}
            lg={{ span: 4, offset: 3 }}
          >
            <PocketBox iconUrl={"/assets/circle.png"}>
              <h1 className="forgotPassword">
                Answer this question before continuing.
              </h1>
              <p className="passwordLabel"></p>
              <Form id={"main-form"} onSubmit={this.handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label id="email-label">
                    What was the name of your first pet?
                  </Form.Label>
                  <Form.Control
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                    className="emailInput"
                  />
                </Form.Group>
                <Button
                  className="resetButton"
                  type="submit"
                  variant="primary"
                  size={"md"}
                >
                  <span className="resetButtonText">Continue</span>
                </Button>
              </Form>
            </PocketBox>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default AnswerSecurityQuestions;
