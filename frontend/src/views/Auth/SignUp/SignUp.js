import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {AuthProviderButton, AuthProviderType} from "../../../core/components/AuthProviderButton";
import HelpLink from "../../../core/components/HelpLink";
import UserService from "../../../core/services/PocketUserService";
import "./SignUp.scss";
import {ROUTE_PATHS} from "../../../_routes";
import AuthSidebar from "../../../core/components/AuthSidebar";

class SignUp extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      authProviders: [],
      signedIn: false,
      data: {
        username: "",
        email: "",
        password1: "",
        password2: "",
      }
    };
  }

  componentDidMount() {
    /** @type {UserService} */
    UserService.getAuthProviders().then(providers => {
      this.setState({authProviders: providers});
    });
  }

  validateSignUp(username, email, password1, password2) {
    // TODO: Add more validations.
    if (password1 !== password2) {
      return "Passwords don't match";
    }
    return "";
  }

  async handleSignUp(e) {
    e.preventDefault();
    const {username, email, password1, password2} = this.state.data;

    const validationMsg = this.validateSignUp(username, email, password1, password2);

    if (validationMsg !== "") {
      // TODO: Show proper message on front end to user.
      console.log(validationMsg);
      return;
    }

    const {success, data: error} = await UserService.signUp(username, email, password1, password2);

    if (!success) {
      // TODO: Show proper message on front end to user.
      console.log(error.response.data.message);
    }

    this.setState({signedIn: success});
  };


  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }


  render() {
    const {login, verify_email} = ROUTE_PATHS;
    const {signedIn, data} = this.state;
    const {username, email, password1, password2} = data;

    if (signedIn) {
      return <Redirect to={verify_email}/>;
    }

    return (
      <Container fluid className={"Auth-page"}>
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
              <Form onSubmit={this.handleSignUp} id={"main-form"}>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    name="username"
                    value={username}
                    onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password1"
                    value={password1}
                    onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password2"
                    value={password2}
                    onChange={this.handleChange}/>
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
