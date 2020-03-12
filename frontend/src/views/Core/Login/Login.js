import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";


import "./Login.scss";

class Login extends Component {
  render() {
    return (
      <Container fluid id={"login-page"}>
        <Row>
          <Col xs={2} sm={3} lg={3} id={"sidebar"}>
            <Row>
              <img src={"/logo.png"} alt="logo" id={"main-logo"}/>
            </Row>
            <Row id={"title"}>
              <h1>
                We are <br/>
                pocket <br/>
                network
              </h1>
            </Row>
            <Row>
              <p>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Pocket Network's mission is to ensure the sustainable <br/>
                Decentralization of blockchain infrastructure. In a <br/>
                market that is over-reliant on single-service provider.
              </p>
            </Row>
          </Col>
          <Col id={"content"}>
            <div className={"help text"}>
              <Button variant={"link"}><FontAwesomeIcon icon={faQuestionCircle}/></Button>
            </div>

            <div id={"main"}>
              <h1>Login</h1>
              <div id={"provider-buttons"}>
                <Button variant="outline-secondary" size={"lg"} block className={"rounded-pill"}>Login with
                  Google</Button>
                <Button variant="outline-secondary" size={"lg"} block className={"rounded-pill"}>Login with
                  Github</Button>
              </div>
              <hr/>
              <Form id={"main-form"}>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email"/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password"/>
                </Form.Group>
                <p>Forgot your password? <a href="#">click here</a></p>

                <Button type="submit" variant="dark" size={"lg"} block>Login</Button>
                <div>
                  {/* eslint-disable-next-line */}
                  <a href="#">You don't have an account?</a>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
