import React, {Component} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import PocketUserService from "../../../core/services/PocketUserService";

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
        <Row>
          <Col lg="8" md="8" sm="8">
            <h2>General Information</h2>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name="username"
                  value={username}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Button
                className="pr-5 pl-5 float-right"
                type="submit"
                variant="dark"
                size={"lg"}
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
