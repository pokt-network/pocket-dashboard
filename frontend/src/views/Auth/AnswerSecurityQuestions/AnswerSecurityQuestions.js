import React, { Component } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import "./AnswerSecurityQuestions.scss";
import Navbar from "../../../core/components/Navbar";
import PocketBox from "../../../core/components/PocketBox/PocketBox";
import SecurityQuestionService from "../../../core/services/PocketSecurityQuestionsService";
import { ROUTE_PATHS } from "../../../_routes";
import PocketUserService from "../../../core/services/PocketUserService";

class AnswerSecurityQuestions extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cleanFieldValues = this.cleanFieldValues.bind(this);

    this.state = {
      data: {
        email: "",
      },
      questions: [
        { question: "" },
        { question: "" },
        { question: "" },
      ],
      answer: "",
      userInput: "",
      error: "",
    };
  }
  async componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const email = this.props.location.state
      ? // eslint-disable-next-line react/prop-types
        this.props.location.state.email
      : undefined;

    if (email !== undefined) {
      const questions = await SecurityQuestionService.getUserSecurityQuestions(
        email
      );

      if (questions.success) {
        this.setState({
          questions: questions.data
        });
      }
    }
  }

  cleanFieldValues() {
    // Retrieve all three answer fields
    const answerLabel1 = document.getElementById("answer-label-1");
    const answerLabel2 = document.getElementById("answer-label-2");
    const answerLabel3 = document.getElementById("answer-label-3");

    // Check if elements are not undefined
    if (answerLabel1 && answerLabel2 && answerLabel3) {
      answerLabel1.value = "";
      answerLabel2.value = "";
      answerLabel3.value = "";
    }
  }

  handleChange({ currentTarget: input }) {
    const data = { ...this.state.data };

    data[input.name] = input.value;
    this.setState({ data });
  }

  async handleSubmit(e) {
    e.preventDefault();
    // Retrieve the answers
    const answer1 = e.target.elements.answer1.value;
    const answer2 = e.target.elements.answer2.value;
    const answer3 = e.target.elements.answer3.value;

    if (answer1.length > 0 && answer2.length > 0 && answer3.length > 0) {
      const answeredQuestions = [
        { question: this.state.questions[0].question, answer: answer1 },
        { question: this.state.questions[1].question, answer: answer2 },
        { question: this.state.questions[2].question, answer: answer3 }
      ];

      // eslint-disable-next-line react/prop-types
      const email = this.props.location.state.email;

      // Validate answers
      const isValid = await SecurityQuestionService.validateUserSecurityQuestions(email, answeredQuestions);

      // Password reset link page
      const passwordResetLinkPage = `${window.location.origin}${ROUTE_PATHS.reset_password}`;

      if (isValid.success === true && isValid.data === true) {
        // Send password reset email
        const result = await PocketUserService.sendResetPasswordEmail(email, passwordResetLinkPage);

        if (result.success) {
          // eslint-disable-next-line react/prop-types
          this.props.history.push({
            pathname: ROUTE_PATHS.reset_password_email,
            state: { email },
          });
        } else {
          this.setState({ error: "Failed to send the reset password email." });
        }
      } else {
        this.cleanFieldValues();
        this.setState({ error: "Incorrect answer" });
      }
    }
  }

  render() {
    const { questions, error } = this.state;

    return (
      <Container fluid id={"answer-security-questions-page"}>
        <Navbar />
        <Row className="mt-1">
          <div id={"main"}>
            <PocketBox iconUrl={"/assets/squared.png"}>
              <h1 className="forgotPassword">
                Answer this question before continuing.
              </h1>

              <Form autoComplete="off" id={"main-form"} onSubmit={this.handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label id="question-label-1">{questions[0].question}</Form.Label>
                  <Form.Control
                    id="answer-label-1"
                    onChange={this.handleChange}
                    name="answer1"
                    type="input"
                    className={error ? "is-invalid emailInput" : "emailInput"}
                  />{" "}
                  <Form.Control.Feedback className="feedback" type="invalid">
                    {error ? error : ""}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label id="question-label-2">{questions[1].question}</Form.Label>
                  <Form.Control
                    id="answer-label-2"
                    onChange={this.handleChange}
                    name="answer2"
                    type="input"
                    className={error ? "is-invalid emailInput" : "emailInput"}
                  />{" "}
                  <Form.Control.Feedback className="feedback" type="invalid">
                    {error ? error : ""}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label id="question-label-3">{questions[2].question}</Form.Label>
                  <Form.Control
                    id="answer-label-3"
                    onChange={this.handleChange}
                    name="answer3"
                    type="input"
                    className={error ? "is-invalid emailInput" : "emailInput"}
                  />{" "}
                  <Form.Control.Feedback className="feedback" type="invalid">
                    {error ? error : ""}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  className="resetButton"
                  type="submit"
                  variant="primary"
                  size={"md"}
                >
                  <span>Continue</span>
                </Button>
              </Form>
            </PocketBox>
          </div>
        </Row>
      </Container>
    );
  }
}

export default AnswerSecurityQuestions;
