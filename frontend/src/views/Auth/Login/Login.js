import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "./Login.scss";
import {AuthProviderButton, AuthProviderType} from "../../../core/components/AuthProviderButton";
import HelpLink from "../../../core/components/HelpLink";
import UserService from "../../../core/services/PocketUserService";
import {routePaths} from "../../../_routes";
import {Link} from "react-router-dom";
import AuthSidebar from "../../../core/components/AuthSidebar";
import PocketUserService from "../../../core/services/PocketUserService";

class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      authProviders: [],
      data: {
        username: "",
        password: ""
      }
    };
  }

  componentDidMount() {
    /** @type {UserService} */
    UserService.getAuthProviders().then(providers => {
      this.setState({authProviders: providers});
    });
  }

  handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = this.state.data;

    const validationMsg = PocketUserService.validateLogin(username, 
      password);

    if (validationMsg !== '') {
      console.log(validationMsg);
      return;
    } 

    try {
      await PocketUserService.login(username, password);
      return this.props.history.replace('/dashboard');
    } catch(err) {
      console.log(err.data);
    }
  }

  handleChange = ({ currentTarget: input }) => {
    const data = {...this.state.data};
    data[input.name] = input.value;
    this.setState({ data })
  }

  render() {
    const {signup, forgot_password} = routePaths;
    const { username, password } = this.state.data;

    return (
      <Container fluid className={"auth-page"}>
        <Row>
          <AuthSidebar/>
          <Col className={"content"}>
            <HelpLink/>

            <div className={"main"}>
              <h1>Login</h1>
              <div id={"provider-buttons"}>
                <AuthProviderButton type={AuthProviderType.login}
                                    authProvider={UserService.getAuthProvider(this.state.authProviders, "google")}
                />
                <AuthProviderButton type={AuthProviderType.login}
                                    authProvider={UserService.getAuthProvider(this.state.authProviders, "github")}
                />
              </div>
              <hr/>
              <Form id={"main-form"}>
                <Form.Group>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control name="username" value={username} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control required type="password" name="password" value={password} onChange={this.handleChange}/>
                </Form.Group>
                <p>
                  Forgot your password? <Link to={forgot_password}>click here</Link>
                </p>

                <Button onClick={this.handleLogin} type="submit" variant="dark" size={"lg"} block>
                  Login
                </Button>
                <div>
                  {/* eslint-disable-next-line */}
                  <Link to={signup}>You don't have an account?</Link>
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
