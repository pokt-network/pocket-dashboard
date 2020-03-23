import React, { Component } from "react";
import "./SecurityQuestions.scss";
import Navbar from "../../../core/components/Navbar";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import UserService from "../../../core/services/PocketUserService";

const QUESTIONS_QUANTITY = 3;
class SecurityQuestions extends Component {
  // TODO: Integrate with backend

  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendQuestions = this.sendQuestions.bind(this);

    this.state = {
      securityQuestions: [],
      // TODO: Define where email would be obtained (I recommend from URL query)
      email: "",
      chosenQuestions: new Array(QUESTIONS_QUANTITY),
      data: {
        answer1: "",
        answer2: "",
        answer3: ""
      }
    };
  }

  async componentDidMount() {
    const { success, data } = await UserService.getSecurityQuestions();
    if (!success) {
      // TODO: Properly log error in frontend
      console.log(data);
      return;
    }
    const securityQuestions = ["Select one", ...data];
    this.setState({ securityQuestions });
  }

  handleSelect(e, index) {
    const chosenQuestions = [...this.state.chosenQuestions];
    chosenQuestions[index] = e.target.value;
    this.setState({ chosenQuestions });
  }

  handleChange({ currentTarget: input }) {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  }

  async sendQuestions(e) {
    e.preventDefault();
    const { email, chosenQuestions } = this.state;
    const { answer1, answer2, answer3 } = this.state.data;
    const questions = [
      { question: chosenQuestions[0], answer: answer1 },
      { question: chosenQuestions[1], answer: answer2 },
      { question: chosenQuestions[2], answer: answer3 }
    ];

    const { success, data } = await UserService.sendSecurityQuestions(
      email,
      questions
    );
    if (!success) {
      // TODO: Properly log error in frontend
      console.log(data);
      return;
    }
    // TODO: Remove and redirect user to proper page (could it be /dashboard?)
    console.log(data);
  }

  render() {
    const { securityQuestions } = this.state;
    const { answer1, answer2, answer3 } = this.state.data;

    return (
      <Container fluid id={"security-questions-page"}>
        <Navbar />
        <Row>
          <Col
            id="main"
            md={{ span: 8, offset: 2 }}
            lg={{ span: 6, offset: 3 }}
          >
            <Form onSubmit={this.sendQuestions}>
              <Form.Group>
                <Form.Label>Question 1</Form.Label>
                <Form.Control
                  as="select"
                  onChange={e => this.handleSelect(e, 0)}
                >
                  {securityQuestions.map(question => (
                    <option key={question}>{question}</option>
                  ))}
                </Form.Control>
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  name="answer1"
                  value={answer1}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <hr />
              <Form.Group>
                <Form.Label>Question 2</Form.Label>
                <Form.Control
                  as="select"
                  onChange={e => this.handleSelect(e, 1)}
                >
                  {securityQuestions.map(question => (
                    <option key={question}>{question}</option>
                  ))}
                </Form.Control>
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  name="answer2"
                  value={answer2}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <hr />
              <Form.Group>
                <Form.Label>Question 3</Form.Label>
                <Form.Control
                  as="select"
                  onChange={e => this.handleSelect(e, 2)}
                >
                  {securityQuestions.map(question => (
                    <option key={question}>{question}</option>
                  ))}
                </Form.Control>
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  name="answer3"
                  value={answer3}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Button type="submit" variant="dark" size={"lg"} block>
                Save
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SecurityQuestions;
