import React, {Component} from "react";
import "./SecurityQuestions.scss";
import Navbar from "../../../core/components/Navbar";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import SecurityQuestionsService from "../../../core/services/PocketSecurityQuestionsService";
import AppSteps from "../../../core/components/AppSteps/AppSteps";
import PocketUserService from "../../../core/services/PocketUserService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import qs from "qs";

const QUESTIONS_QUANTITY = 3;

class SecurityQuestions extends Component {

  constructor(props) {
    super(props);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendQuestions = this.sendQuestions.bind(this);

    this.state = {
      securityQuestions: [],
      user: null,
      chosenQuestions: new Array(QUESTIONS_QUANTITY),
      data: {
        answer1: "",
        answer2: "",
        answer3: "",
      },
    };
  }

  componentDidMount() {

    // eslint-disable-next-line react/prop-types
    const queryParam = qs.parse(this.props.location.search, {ignoreQueryPrefix: true});

    if (queryParam === undefined || queryParam.d === undefined) {
      // TODO: Show message on frontend
      return;
    }

    PocketUserService.validateToken(queryParam.d).then(result => {
      if (result.success) {
        this.setState({user: result.data});
      } else {
        // TODO: Show proper message on front end to user.
      }
    });

    SecurityQuestionsService.getSecurityQuestions().then((questions) => {
      const securityQuestions = ["Select Question", ...questions];

      this.setState({securityQuestions});
    });
  }


  validateQuestion(ordinalNumber, question) {
    if (question.question === undefined) {
      return `${ordinalNumber} question cannot be empty`;
    }

    if (question.answer === "") {
      return `${ordinalNumber} answer cannot be empty`;
    }

    return "";
  }


  validateQuestions(questions) {
    const firstQuestion = this.validateQuestion("First", questions[0]);
    const secondQuestion = this.validateQuestion("Second", questions[1]);
    const thirdQuestion = this.validateQuestion("Third", questions[2]);

    if (firstQuestion !== "") {
      return firstQuestion;
    }

    if (secondQuestion !== "") {
      return secondQuestion;
    }

    if (thirdQuestion !== "") {
      return thirdQuestion;
    }

    return "";
  }

  handleSelect(e, index) {
    const chosenQuestions = [...this.state.chosenQuestions];

    chosenQuestions[index] = e.target.value;
    this.setState({chosenQuestions});
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  async sendQuestions(e) {
    e.preventDefault();
    const {user, chosenQuestions} = this.state;
    const {answer1, answer2, answer3} = this.state.data;
    const questions = [
      {question: chosenQuestions[0], answer: answer1},
      {question: chosenQuestions[1], answer: answer2},
      {question: chosenQuestions[2], answer: answer3},
    ];

    const validationMsg = this.validateQuestions(questions);

    if (validationMsg !== "") {
      // TODO: Show proper message on front end to user.
      return;
    }

    const {
      success,
    } = await SecurityQuestionsService.saveSecurityQuestionAnswers(user.email, questions);

    if (!success) {
      // TODO: Properly log error in frontend
      return;
    }

    PocketUserService.saveUserInCache(user, true);

    // eslint-disable-next-line react/prop-types
    this.props.history.push(_getDashboardPath(DASHBOARD_PATHS.home));
  }

  render() {
    const {securityQuestions} = this.state;
    const {answer1, answer2, answer3} = this.state.data;

    const icons = [
      /* eslint-disable jsx-a11y/alt-text */
      <img key={0} src="/assets/user.svg" className="step-icon" />,
      <img key={1} src="/assets/mail.svg" className="step-icon" />,
      <img key={2} src="/assets/key.svg" className="step-icon" />,
      /* eslint-enable jsx-a11y/alt-text */
    ];

    return (
      <Container fluid id={"security-questions-page"}>
        <Navbar/>
        <Row className="mb-3">
          <Col lg={{span: 8, offset: 2}}>
            <AppSteps
              icons={icons}
              steps={[
                "Account Created",
                "Email Verified",
                "Security Questions",
              ]}
              current={2}
            />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col id="main" md={{span: 6, offset: 2}} lg={{span: 4, offset: 4}}>
            <h1 className="text-uppercase">
              Please answer the security questions befere creating a new account
            </h1>
            <Form onSubmit={this.sendQuestions}>
              <Form.Group>
                <Form.Label>Question 1</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => this.handleSelect(e, 0)}
                >
                  {securityQuestions.map((question) => (
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
              <hr/>
              <Form.Group>
                <Form.Label>Question 2</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => this.handleSelect(e, 1)}
                >
                  {securityQuestions.map((question) => (
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
              <hr/>
              <Form.Group>
                <Form.Label>Question 3</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => this.handleSelect(e, 2)}
                >
                  {securityQuestions.map((question) => (
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
              <Button
                className="font-weight-light mb-5 pt-2 pb-2 pl-5 pr-5"
                type="submit"
                variant="primary"
                size={"md"}
              >
                Continue
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SecurityQuestions;
