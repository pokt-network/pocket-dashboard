import React, {Component} from "react";
import {Button, Modal, Form} from "react-bootstrap";
import PocketSecurityQuestionsService from "../services/PocketSecurityQuestionsService";
import PocketUserService from "../services/PocketUserService";
import {PropTypes} from "prop-types";

class SecurityQuestionModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);

    this.state = {
      question: "",
      answer: "",
      error: "",
      data: {
        userAnswer: "",
      },
    };
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  async componentDidMount() {
    const {email} = PocketUserService.getUserInfo();

    const {
      success,
    } = await PocketSecurityQuestionsService.getUserRandomSecurityQuestion(
      email
    );

    if (success !== false) {
      this.setState({question: success.question, answer: success.answer});
    }
  }

  checkAnswer() {
    const {answer} = this.state;
    const {userAnswer} = this.state.data;
    const {onClose, onAfterValidation} = this.props;

    if (answer.toLowerCase() !== userAnswer.toLowerCase()) {
      this.setState({error: "Incorrect answer"});
      return;
    }

    onClose();
    onAfterValidation();
  }

  render() {
    const {question, error} = this.state;
    const {userAnswer} = this.state.data;
    const {show, onClose} = this.props;

    return (
      <Modal
        className="app-modal security-question-modal"
        show={show}
        onHide={onClose}
        animation={false}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>Answer this question before continuing</h4>
          <Form.Group>
            <Form.Label>{question}</Form.Label>
            <Form.Control
              name="userAnswer"
              value={userAnswer}
              onChange={this.handleChange}
              className={error ? "is-invalid" : ""}
            />
            <Form.Control.Feedback className="invalid-acount" type="invalid">
              {error ? error : ""}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button block variant="dark" onClick={this.checkAnswer}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SecurityQuestionModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAfterValidation: PropTypes.func.isRequired,
};

export default SecurityQuestionModal;
