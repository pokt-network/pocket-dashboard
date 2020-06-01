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
import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {Formik} from "formik";
import * as yup from "yup";
import {VALIDATION_MESSAGES} from "../../../_constants";
import {validateYup} from "../../../_helpers";
import cls from "classnames";

class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleLogin = this.handleLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);

    this.schema = yup.object().shape({
      email: yup
        .string()
        .email(VALIDATION_MESSAGES.EMAIL)
        .required(VALIDATION_MESSAGES.REQUIRED),
      password: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
    });

    this.state = {
      authProviders: [],
      loggedIn: false,
      data: {
        email: "",
        password: "",
      },
      user: {},
    };
  }

  componentDidMount() {
    /** @type {UserService} */
    UserService.getAuthProviders().then((providers) => {
      this.setState({authProviders: providers});
    });
  }

  async handleLogin(e) {
    e.preventDefault();

    this.setState({loggedIn: true});
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  async validate(values) {
    let errors = {};
    let yupErr;

    yupErr = await validateYup(values, this.schema);

    if (yupErr) {
      return yupErr;
    }

    const {success, data} = await UserService.login(
      values.email, values.password
    );

    if (!success) {
      const {message: err} = data.response.data;

      if (err === "Error: Passwords do not match") {
        errors.password = "Wrong password";
      } else if (err === "Error: Invalid username.") {
        errors.email = "invalid email.";
      }
    } else {
      this.setState({user: data});
    }

    return errors;
  }

  render() {
    const {home, signup, forgot_password} = ROUTE_PATHS;
    const {loggedIn} = this.state;

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
            <Row className="justify-content-center">
              <div className={"main"}>
                <h2>Log in</h2>
                <Formik
                  validate={this.validate}
                  // validationSchema={this.schema}
                  onSubmit={() => {
                    UserService.saveUserInCache(this.state.user, true);
                    UserService.showWelcomeMessage(true);
                    this.setState({loggedIn: true});
                  }}
                  initialValues={this.state.data}
                  values={this.state.data}
                  validateOnChange={false}
                  validateOnBlur={false}
                >
                  {({handleSubmit, handleChange, values, errors}) => (
                    <Form noValidate onSubmit={handleSubmit} id={"main-form"}>
                      <Form.Group>
                        <Form.Label>Email</Form.Label>

                        <Form.Control
                          name="email"
                          placeholder="example@email.com"
                          value={values.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          className="inputControl"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="**************"
                          value={values.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                          className={`inputControl ${cls({
                            "text-hidden": values.password.length === 0,
                          })}`}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                        <Link to={forgot_password}>Forgot your password?</Link>
                      </Form.Group>

                      <Button
                        type="submit"
                        size="md"
                        variant="primary"
                        block
                        className="center inputButton"
                      >
                        Sign in
                      </Button>
                      <div className="containerDiv">
                        <div className="divider mt-3 mb-3">Or</div>
                        <div id={"provider-buttons"}>
                          <AuthProviderButton
                            block={true}
                            className="brand pl-4 pr-4 mr-3 center"
                            icon={faGoogle}
                            type={AuthProviderType.login}
                            authProvider={UserService.getAuthProvider(
                              this.state.authProviders, "google"
                            )}
                          />
                          <AuthProviderButton
                            block={true}
                            className="brand pl-4 pr-4 center"
                            icon={faGithub}
                            type={AuthProviderType.login}
                            authProvider={UserService.getAuthProvider(
                              this.state.authProviders, "github"
                            )}
                          />
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
