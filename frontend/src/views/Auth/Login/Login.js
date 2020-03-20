import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "./Login.scss";
import {AuthProviderButton, AuthProviderType} from "../../../core/components/AuthProviderButton";
import HelpLink from "../../../core/components/HelpLink";
import UserService from "../../../core/services/PocketUserService";
import {routePaths} from "../../../_routes";
import {Link} from "react-router-dom";
import AuthSidebar from "../../../core/components/AuthSidebar";

class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleLogin = this.handleLogin.bind(this);


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

  /**
   * Validate user login data.
   *
   * @param {string} username Username of user to login.
   * @param {string} password Password of user.
   *
   * @return {string} Message about error or empty if there's none
   */
  validateLogin(username, password) {
    if (username === "" || password === "" )
      return "Username or password cannot be empty";
    return "";
  }

  async handleLogin(e)  {
    e.preventDefault();
    const { username, password } = this.state.data;

    const validationMsg = this.validateLogin(username, 
      password);

    if (validationMsg !== '') {
      console.log(validationMsg);
      return;
    } 

    const { home } = routePaths;
    const { success, data: error } = await UserService.login(
      username,
      password
    );

    if (success) return this.props.history.replace(home);
    // TODO: Show proper message on front end to user.
    console.log(error.response.data);
  }

  handleChange = ({ currentTarget: input }) => {
    const data = {...this.state.data};
    data[input.name] = input.value;
    this.setState({ data });
  }

  render() {
    const {signup, forgot_password} = routePaths;
    const { username, password} = this.state.data;

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
              <Form onSubmit={this.handleLogin} id={"main-form"}>
                <Form.Group>
                  <Form.Label>Username or E-mail</Form.Label>
                  <Form.Control name="username" value={username} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={password} onChange={this.handleChange}/>
                </Form.Group>
                <p>
                  Forgot your password? <Link to={forgot_password}>click here</Link>
                </p>

                <Button type="submit" variant="dark" size={"lg"} block>
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
