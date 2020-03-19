import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { AuthProviderButton } from "../../../core/components/AuthProviderButton";
import HelpLink from "../../../core/components/HelpLink";
import Sidebar from "../../../core/components/Sidebar";
import UserService from "../../../core/services/PocketUserService";
import "../Login/Login.scss";
import { routePaths } from "../../../_routes";

class SignUp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      authProviders: []
    };
  }

  componentDidMount() {
    /** @type {UserService} */
    UserService.getAuthProviders().then(providers => {
      this.setState({ authProviders: providers });
    });
  }

  // TODO: Refactor logic from providers to be shared by both sign up and
  // login
  /**
   * @param {string} name Name of auth provider.
   *
   * @return {{name: string, consent_url:string}}
   * @private
   */
  __getAuthProvider(name) {
    /** @type {Array.<{name:string, consent_url:string}>} */
    const authProviders = this.state.authProviders;

    return authProviders.filter(
      value => value.name.toLowerCase() === name.toLowerCase()
    )[0];
  }

  render() {
    const { login } = routePaths;
    return (
      <Container fluid id={"login-page"}>
        <Row>
          <Sidebar />
          <Col id={"content"}>
            <HelpLink />

            <div id={"main"}>
              <h1>Create Account</h1>
              <div id={"provider-buttons"}>
                <AuthProviderButton
                  authProvider={this.__getAuthProvider("google")}
                />
                <AuthProviderButton
                  authProvider={this.__getAuthProvider("github")}
                />
              </div>
              <hr />
              <Form id={"main-form"}>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>

                <Button type="submit" variant="dark" size={"lg"} block>
                  Login
                </Button>
                <div>
                  <Link to={login}>Do you have an account?</Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignUp;
