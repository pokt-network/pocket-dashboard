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

    const {success, data: error} = await UserService.login(
      values.email, values.password);

    if (!success) {
      const {message: err} = error.response.data;

      if (err === "Error: Passwords do not match") {
        errors.password = "Wrong password";
      } else if (err === "Error: Invalid username.") {
        errors.email = "invalid email.";
      }
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
            <Row>
              <Col lg={{span: 5, offset: 3}}>
                <div className={"main"}>
                  <h2>Login</h2>
                  <Formik
                    validate={this.validate}
                    // validationSchema={this.schema}
                    onSubmit={() => {
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
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <p>
                          <Link to={forgot_password}>
                            Forgot your password?
                          </Link>
                        </p>

                        <Button type="submit" size="md" variant="primary" block>
                          Sign in
                        </Button>
                        <div className="divider mt-4 mb-3">Or</div>
                        <div id={"provider-buttons"}>
                          <AuthProviderButton
                            block={true}
                            className="brand pl-5 pr-5 mr-3"
                            icon={faGoogle}
                            type={AuthProviderType.login}
                            authProvider={UserService.getAuthProvider(
                              this.state.authProviders, "google"
                            )}
                          />
                          <AuthProviderButton
                            block={true}
                            className="brand pl-4 pr-4"
                            icon={faGithub}
                            type={AuthProviderType.login}
                            authProvider={UserService.getAuthProvider(
                              this.state.authProviders, "github"
                            )}
                          />
                        </div>
                      </Form>
                    )}
                  </Formik>
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
