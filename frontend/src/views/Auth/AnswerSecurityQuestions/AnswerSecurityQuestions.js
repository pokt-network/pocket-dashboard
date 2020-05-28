import React, { Component } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./AnswerSecurityQuestions.scss";
import Navbar from "../../../core/components/Navbar";
import PocketBox from "../../../core/components/PocketBox/PocketBox";
//import UserService from "../../../core/services/PocketUserService";
import SecurityQuestionService from "../../../core/services/PocketSecurityQuestionsService";
import { ROUTE_PATHS } from "../../../_routes";

class AnswerSecurityQuestions extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data: {
        email: "",
      },
      question: "",
      answer: "",
      userInput: "",
    };
  }
  async componentDidMount() {
    const { email } = this.props.location.state;

    if (email !== undefined) {
      const questions = await SecurityQuestionService.getUserRandomSecurityQuestion(
        email
      );

      if (questions.success !== undefined) {
        this.setState({
          question: questions.success.question,
          answer: questions.success.answer.toLowerCase(),
        });
      }
    }

    // eslint-disable-next-line react/prop-types
  }

  handleChange({ currentTarget: input }) {
    const data = { ...this.state.data };

    data[input.name] = input.value;
    this.setState({ data });
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.props.location.state.email;
    const userInput = this.state.data.answer.toLocaleLowerCase();

    if (userInput === this.state.answer) {
      this.props.history.push({
        pathname: ROUTE_PATHS.reset_password,
        state: { email },
      });
    } else {
      console.log("wrong answer");
      // TODO display error message
    }
  }

  render() {
    const { question } = this.state;

    return (
      <Container fluid id={"answer-security-questions-page"}>
        <Navbar />
        <Row className="mt-1">
          <Col
            id={"main"}
            md={{ span: 8, offset: 2 }}
            lg={{ span: 4, offset: 3 }}
          >
            <PocketBox iconUrl={"/assets/squared.png"}>
              <h1 className="forgotPassword">
                Answer this question before continuing.
              </h1>
              <p className="passwordLabel"></p>
              <Form id={"main-form"} onSubmit={this.handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label id="email-label">{question}</Form.Label>
                  <Form.Control
                    onChange={this.handleChange}
                    name="answer"
                    type="input"
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
