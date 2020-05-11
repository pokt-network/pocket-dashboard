import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "./Login.scss";
import {
  AuthProviderButton,
  AuthProviderType,
} from "../../../core/components/AuthProviderButton";
import UserService from "../../../core/services/PocketUserService";
import {ROUTE_PATHS} from "../../../_routes";
import {Link, Redirect} from "react-router-dom";
import AuthSidebar from "../../../core/components/AuthSidebar/AuthSidebar";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";

class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      authProviders: [],
      loggedIn: false,
      data: {
        username: "",
        password: "",
      },
    };
  }

  componentDidMount() {
    /** @type {UserService} */
    UserService.getAuthProviders().then((providers) => {
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
    if (username === "" || password === "") {
      return "Username or password cannot be empty";
    }
    return "";
  }

  async handleLogin(e) {
    e.preventDefault();
    const {username, password} = this.state.data;

    const validationMsg = this.validateLogin(username, password);

    if (validationMsg !== "") {
      // TODO: Show proper message on front end to user.
      console.log(validationMsg);
      return;
    }

    const {success, data: error} = await UserService.login(username, password);

    if (!success) {
      // TODO: Show proper message on front end to user.
      console.log(error.response.data.message);
    }

    this.setState({loggedIn: success});
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  render() {
    const {home, signup, forgot_password} = ROUTE_PATHS;
    const {loggedIn, data} = this.state;
    const {username, password} = data;

    if (loggedIn) {
      return <Redirect to={home} />;
    }

    return (
      <Container fluid className={"auth-page"} id="login">
        <Row>
          <AuthSidebar />
          <Col className={"content"}>
            <div className="change">
              <p>
                New in Pocket Dashboard?{" "}
                <Link to={signup}>Create an account</Link>
              </p>
            </div>
            <Row>
              <Col lg={{span: 5, offset: 3}}>
                <div className={"main"}>
                  <h2>Login</h2>
                  <Form onSubmit={this.handleLogin} id={"main-form"}>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        name="username"
                        value={username}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="**************"
                        value={password}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                    <p>
                      <Link to={forgot_password}>Forgot your password?</Link>
                    </p>

                    <Button type="submit" size="lg" variant="primary" block>
                      Sign in
                    </Button>
                    <div className="divider mt-4 mb-3">Or</div>
                    <div id={"provider-buttons"}>
                      <AuthProviderButton
                        block={false}
                        className="brand pl-5 pr-5 mr-3"
                        icon={faGoogle}
                        type={AuthProviderType.login}
                        authProvider={UserService.getAuthProvider(
                          this.state.authProviders, "google"
                        )}
                      />
                      <AuthProviderButton
                        block={false}
                        className="brand pl-5 pr-5"
                        icon={faGithub}
                        type={AuthProviderType.login}
                        authProvider={UserService.getAuthProvider(
                          this.state.authProviders, "github"
                        )}
                      />
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
