import React, {Component} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import PocketUserService from "../../../core/services/PocketUserService";
import "./General.scss";

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
          <Col lg={{span: 7, offset: 2}} className="body title-page">
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
                size={"md"}
                onClick={() => {
                  this.setState({passwordModal: true});
                }}
              >
                Save
              </Button>
            </Form>
          </Col>
        </Row>
        <Modal
          className="app-modal"
          show={passwordModal}
          onHide={() => this.setState({passwordModal: false})}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Answer this question before continuing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              {/* TODO: Add retrieve question from backend */}
              <Form.Label>What was the name of your first child?</Form.Label>
              <Form.Control
                name="username"
                value={username}
                onChange={this.handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              variant="dark"
              className="pr-4 pl-4"
              onClick={this.handleSubmit}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default General;
