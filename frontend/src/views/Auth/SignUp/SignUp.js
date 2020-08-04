import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {
  AuthProviderButton,
  AuthProviderType,
} from "../../../core/components/AuthProviderButton";
import PocketUserService from "../../../core/services/PocketUserService";
import "./SignUp.scss";
import {
  ROUTE_PATHS,
} from "../../../_routes";
import AuthSidebar from "../../../core/components/AuthSidebar/AuthSidebar";
import {Formik} from "formik";
import * as yup from "yup";
import {VALIDATION_MESSAGES} from "../../../_constants";
import {faGithub, faGoogle} from "@fortawesome/free-brands-svg-icons";
import {validateYup} from "../../../_helpers";
import ReCAPTCHA from "react-google-recaptcha";
import {Configurations} from "../../../_configuration";
import cls from "classnames";

class SignUp extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validate = this.validate.bind(this);
    this.validateCaptcha = this.validateCaptcha.bind(this);

    this.schema = yup.object().shape({
      email: yup
        .string()
        .email(VALIDATION_MESSAGES.EMAIL)
        .required(VALIDATION_MESSAGES.REQUIRED),
      username: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
      password1: yup
        .string()
        .min(8, VALIDATION_MESSAGES.MIN(8))
        .required(VALIDATION_MESSAGES.REQUIRED),
      password2: yup
        .string()

        .required(VALIDATION_MESSAGES.REQUIRED)
        .oneOf([yup.ref("password1"), null], "Passwords must match"),
    });

    this.state = {
      authProviders: [],
      backendErrors: "",
      agreeTerms: false,
      validCaptcha: false,
      data: {
        username: "",
        email: "",
        password1: "",
        password2: "",
      },
    };
  }

  componentDidMount() {
    PocketUserService.getAuthProviders().then((providers) => {
      this.setState({authProviders: providers});
    });
  }

  async validate(values) {
    let errors = {};
    let yupErr;

    yupErr = await validateYup(values, this.schema);

    if (yupErr) {
      return yupErr;
    }
    return errors;
  }

  async handleSignUp() {
    this.setState({backendErrors: ""});

    const {username, email, password1, password2} = this.state.data;

    const securityQuestionLinkPage = `${window.location.origin}${ROUTE_PATHS.security_questions}`;

    const {success, data} = await PocketUserService.signUp(
      username, email, password1, password2, securityQuestionLinkPage
    );

    if (!success) {
      this.setState({backendErrors: data.response.data.message});
    } else {
      // eslint-disable-next-line react/prop-types
      this.props.history.push({
        pathname: ROUTE_PATHS.verify_email,
        state: {
          email,
        },
      });
    }
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  async validateCaptcha(token) {
    const {success} = await PocketUserService.verifyCaptcha(token);

    this.setState({validCaptcha: success});
  }

  render() {
    const {login} = ROUTE_PATHS;
    const {agreeTerms, backendErrors, validCaptcha} = this.state;

    return (
      <Container fluid id="signup" className={"auth-page"}>
        <Row>
          <AuthSidebar />
          <Col className={"content auth-scroll"}>
            <div className="change">
              <p>
                Do you have an account? <Link to={login}>Log In</Link>
              </p>
            </div>
            <Row className="justify-content-center">
              <div className={"main"}>
                <h2>Create Account</h2>
                <p className="error">{backendErrors}</p>
                <Formik
                  validate={this.validate}
                  onSubmit={(data) => {
                    this.setState({data});
                    this.handleSignUp();
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
                      <Form.Group>
                        <Form.Label>Username</Form.Label>

                        <Form.Control
                          name="username"
                          placeholder="username"
                          value={values.username}
                          onChange={handleChange}
                          isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password1"
                          placeholder="**************"
                          value={values.password1}
                          onChange={handleChange}
                          isInvalid={!!errors.password1}
                          className={cls({
                            "text-hidden": values.password1.length === 0,
                          })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password1}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password2"
                          placeholder="**************"
                          value={values.password2}
                          onChange={handleChange}
                          isInvalid={!!errors.password2}
                          className={cls({
                            "text-hidden": values.password2.length === 0,
                          })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password2}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <br />
                      <div className="d-flex justify-content-center">
                        <ReCAPTCHA
                          sitekey={Configurations.recaptcha.client}
                          onChange={this.validateCaptcha}
                        />
                      </div>
                      <br />
                      <Form.Check
                        checked={agreeTerms}
                        onChange={() =>
                          this.setState({agreeTerms: !agreeTerms})
                        }
                        id="terms-checkbox"
                        type="checkbox"
                        label={
                          <span className="agreement-label">
                            I agree to Pocket Dashboard{" "}
                            <Link
                              to={ROUTE_PATHS.privacyPolicy}
                              target={"_blank"}
                            >
                              Privacy Policy
                            </Link>
                            &nbsp;and&nbsp;
                            <Link
                              to={ROUTE_PATHS.termsOfService}
                              target={"_blank"}
                            >
                              Terms of Use
                            </Link>
                          </span>
                        }
                      />
                      <br />

                      <Button
                        disabled={!(agreeTerms && validCaptcha)}
                        type="submit"
                        className="sign-up-btn"
                        size="md"
                        variant="primary"
                        block
                      >
                        Sign up
                      </Button>
                      <div className="divider mt-4 mb-3" style={{display: "none"}} >Or</div>
                      <div id={"provider-buttons"} style={{display: "none"}}>
                        <AuthProviderButton
                          block={true}
                          className="brand pl-4 pr-4 mr-3"
                          icon={faGoogle}
                          type={AuthProviderType.signup}
                          authProvider={PocketUserService.getAuthProvider(
                            this.state.authProviders, "google"
                          )}
                        />
                        <AuthProviderButton
                          block={true}
                          className="brand pl-4 pr-4"
                          icon={faGithub}
                          type={AuthProviderType.signup}
                          authProvider={PocketUserService.getAuthProvider(
                            this.state.authProviders, "github"
                          )}
                        />
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

export default SignUp;
