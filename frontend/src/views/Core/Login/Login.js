import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

import "./Login.scss";
import {AuthProviderButton} from "../../../core/components/AuthProviderButton";
import UserService from "../../../core/services/UserService";


class Login extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      authProviders: []
    };
  }

  componentDidMount() {
    /** @type {UserService} */
    UserService.getAuthProviders().then(providers => {
      this.setState({authProviders: providers});
    });
  }

  /**
   * @param {string} name Name of auth provider.
   *
   * @return {{name: string, consent_url:string}}
   */
  getAuthProvider(name) {
    /** @type {Array.<{name:string, consent_url:string}>} */
    const authProviders = this.state.authProviders;

    return authProviders.filter(value => value.name.toLowerCase() === name.toLowerCase())[0];
  }

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
                <AuthProviderButton authProvider={this.getAuthProvider("google")}/>
                <AuthProviderButton authProvider={this.getAuthProvider("github")}/>
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
