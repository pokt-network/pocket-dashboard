import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import PocketUserService from "../../../core/services/PocketUserService";
import "./General.scss";
import SecurityQuestionModal from "../../../core/components/SecurityQuestionModal";

class General extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data: {
        username: "",
        email: "",
      },
      passwordModal: false,
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    // TODO: Integrate logic of changing username/email
  }

  componentDidMount() {
    const {name: username, email} = PocketUserService.getUserInfo();

    this.setState({data: {username, email}});
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  render() {
    const {username, email} = this.state.data;
    const {passwordModal} = this.state;

    return (
      <>
        <Row id="general">
          <Col lg={{span: 10, offset: 1}} className="title-page">
            <div className="wrapper">
              <h1>General Information</h1>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    value={username}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <br />
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <br />
                <Button
                  className=""
                  type="submit"
                  variant="primary"
                  onClick={() => {
                    this.setState({passwordModal: true});
                  }}
                >
                  Save
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
        {passwordModal && (
          <SecurityQuestionModal
            show={passwordModal}
            onClose={() => {
              this.setState({passwordModal: false});
            }}
            // TODO: Implement change password
            onAfterValidation={() => {}}
          />
        )}
      </>
    );
  }
}

export default General;
