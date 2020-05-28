import React, {Component} from "react";
import "./ChangePassword.scss";
import {Col, Button, Form, Row} from "react-bootstrap";

class ChangePassword extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data: {
        oldPassword: "",
        password: "",
        passwordConfirm: "",
      },
    };
  }

  handleSubmit(e) {
    e.preventDefault();
    // TODO: Integrate logic of changing password
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  render() {
    const {oldPassword, password, passwordConfirm} = this.state.data;

    return (
      <Row id="general">
        <Col lg={{span: 10, offset: 1}} className="title-page">
          <div className="body">
            <h1>Change your Password</h1>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group>
                <Form.Label>Old password</Form.Label>
                <Form.Control
                  name="oldPassword"
                  type="password"
                  value={oldPassword}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Password Confirm</Form.Label>
                <Form.Control
                  name="passwordConfirm"
                  value={passwordConfirm}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <br />
              <Button type="submit" variant="primary">
                save
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    );
  }
}

export default ChangePassword;
