import React, { Component } from "react";
import "./SecurityQuestions.scss";
import NavBar from "../../../core/components/NavBar";
import { Button, Container, Col, Row, Form } from "react-bootstrap";
import "./SecurityQuestions.scss";

class SecurityQuestions extends Component {
  // TODO: Integrate with backend
  state = {
    securityQuestions: [
      "What was your childhood nickname?",
      "In what city did you meet your spouse/significant other?",
      "What is the name of your favorite childhood friend?",
      "What street did you live on in third grade?",
      "What is the middle name of your youngest child?",
      "What is your oldest sibling's middle name?",
      "What school did you attend for sixth grade?",
      "What is your oldest cousin's first and last name?",
      "What was the name of your first stuffed animal?",
      "In what city or town did your mother and father meet?",
      "Where were you when you had your first kiss?",
      "What is the first name of the boy or girl that you first kissed?",
      "What was the last name of your third grade teacher?",
      "In what city does your nearest sibling live?",
      "What is your maternal grandmother's maiden name?",
      "In what city or town was your first job?",
      "What is the name of the place your wedding reception was held?"
    ]
  };

  componentDidMount = () => {
    const securityQuestions = ["Select one", ...this.state.securityQuestions];
    this.setState({ securityQuestions });
  };

  handleChange = e => {
    console.log(e.target.value);
  };

  render() {
    const { securityQuestions } = this.state;

    return (
      <Container fluid id={"security-questions-page"}>
        <NavBar />
        <Row>
          <Col
            id="main"
            md={{ span: 8, offset: 2 }}
            lg={{ span: 6, offset: 3 }}
          >
            <Form>
              <Form.Group>
                <Form.Label>Question 1</Form.Label>
                <Form.Control as="select">
                  {securityQuestions.map(question => (
                    <option key={question}>{question}</option>
                  ))}
                </Form.Control>
                <Form.Label>Answer</Form.Label>
                <Form.Control />
              </Form.Group>
              <hr />
              <Form.Group>
                <Form.Label>Question 2</Form.Label>
                <Form.Control as="select">
                  {securityQuestions.map(question => (
                    <option key={question}>{question}</option>
                  ))}
                </Form.Control>
                <Form.Label>Answer</Form.Label>
                <Form.Control />
              </Form.Group>
              <hr />
              <Form.Group>
                <Form.Label>Question 3</Form.Label>
                <Form.Control as="select">
                  {securityQuestions.map(question => (
                    <option key={question}>{question}</option>
                  ))}
                </Form.Control>
                <Form.Label>Answer</Form.Label>
                <Form.Control />
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
