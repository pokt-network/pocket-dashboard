import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
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
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    // TODO: Integrate logic of changing username/password
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

    return (
      <Row>
        <Col lg="8" md="8" sm="8">
          <h2>General Information</h2>
          <Form onSubmit={this.handleSubmit}>
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
            >
              Save
            </Button>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default General;
