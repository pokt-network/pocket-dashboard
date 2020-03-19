import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {AuthProviderButton, AuthProviderType} from "../../../core/components/AuthProviderButton";
import HelpLink from "../../../core/components/HelpLink";
import UserService from "../../../core/services/PocketUserService";
import "./SignUp.scss";
import {routePaths} from "../../../_routes";
import AuthSidebar from "../../../core/components/AuthSidebar";

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
      this.setState({authProviders: providers});
    });
  }

  render() {
    const {login} = routePaths;

    return (
      <Container fluid className={"auth-page"}>
        <Row>
          <AuthSidebar/>
          <Col className={"content"}>
            <HelpLink/>

            <div className={"main"}>
              <h1>Create Account</h1>
              <div id={"provider-buttons"}>
                <AuthProviderButton type={AuthProviderType.signup}
                                    authProvider={UserService.getAuthProvider(this.state.authProviders, "google")}/>
                <AuthProviderButton type={AuthProviderType.signup}
                                    authProvider={UserService.getAuthProvider(this.state.authProviders, "github")}/>
              </div>
              <hr/>
              <Form id={"main-form"}>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email"/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password"/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control type="password"/>
                </Form.Group>

                <Button type="submit" variant="dark" size={"lg"} block>
                  Sign up
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
