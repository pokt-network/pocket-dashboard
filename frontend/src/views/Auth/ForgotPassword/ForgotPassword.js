import React, { Component } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import "./ForgotPassword.scss";
import Navbar from "../../../core/components/Navbar";
import PocketBox from "../../../core/components/PocketBox/PocketBox";
import PocketUserService from "../../../core/services/PocketUserService";
import { ROUTE_PATHS } from "../../../_routes";

class ForgotPassword extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data: {
        email: "",
      },
      error: "",
    };
  }

  handleChange({ currentTarget: input }) {
    const data = { ...this.state.data };

    data[input.name] = input.value;
    this.setState({ data });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const { email } = this.state.data;

    const userExists = await PocketUserService.userExists(email, "email");

    if (userExists) {
      const isValidated = await PocketUserService.isUserValidated(
        email,
        "email"
      );

      if (isValidated) {
        // eslint-disable-next-line react/prop-types
        this.props.history.push({
          pathname: ROUTE_PATHS.answer_security_questions,
          state: { email },
        });
      } else {
        // eslint-disable-next-line react/prop-types
        this.props.history.push({
          pathname: ROUTE_PATHS.verify_email,
          state: {
            email,
          },
        });
      }
    } else {
      this.setState({ error: "Email is not registered" });
    }
  }

  render() {
    const { error } = this.state;

    return (
      <Container fluid id={"forgot-password-page"}>
        <Navbar />
        <Row className="mt-1">
          <div id="main">
            <PocketBox iconUrl={"/assets/circle.png"}>
              <h1 className="forgotPassword">Forgot your password?</h1>
              <p className="passwordLabel">
                Enter your email to reset your password.
              </p>
              <Form id={"main-form"} onSubmit={this.handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label id="email-label">Email Address</Form.Label>
                  <Form.Control
                    onChange={this.handleChange}
                    name="email"
                    type="email"
                    className={error ? "is-invalid emailInput" : "emailInput"}
                  />
                  <Form.Control.Feedback
                    className="feedback invalid-acount"
                    type="invalid"
                  >
                    {error ? error : ""}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  className="resetButton"
                  type="submit"
                  variant="primary"
                  size={"md"}
                >
                  <span>Reset Password</span>
                </Button>
              </Form>
            </PocketBox>
          </div>
        </Row>
      </Container>
    );
  }
}

export default ForgotPassword;
