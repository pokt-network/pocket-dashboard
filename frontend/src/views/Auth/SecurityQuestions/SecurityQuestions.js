import React, {Component} from "react";
import "./SecurityQuestions.scss";
import Navbar from "../../../core/components/Navbar";
import {Button, Col, Container, Form, Row} from "react-bootstrap";

class SecurityQuestions extends Component {
  // TODO: Integrate with backend

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      securityQuestions: []
    };
  }


  componentDidMount = () => {
    const securityQuestions = ["Select one", ...this.state.securityQuestions];
    this.setState({ securityQuestions });
  };

  handleChange(e) {
    // TODO: Remove this
    console.log(e.target.value);
  };

  render() {
    const { securityQuestions } = this.state;

    return (
      <Container fluid id={"security-questions-page"}>
        <Navbar />
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
