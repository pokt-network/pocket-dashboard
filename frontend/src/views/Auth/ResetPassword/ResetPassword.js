import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import Navbar from "../../../core/components/Navbar";
import PocketBox from "../../../core/components/PocketBox/PocketBox";
import {Formik} from "formik";
import * as yup from "yup";
import {VALIDATION_MESSAGES} from "../../../_constants";
import PocketUserService from "../../../core/services/PocketUserService";
import "./ResetPassword.scss";
import AppAlert from "../../../core/components/AppAlert";
import {ROUTE_PATHS} from "../../../_routes";

class ResetPassword extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data: {
        password1: "",
        password2: "",
      },
      alertOverlay: {
        show: false,
        variant: "",
        message: "",
      },
    };
  }

  handleSubmit() {
    // eslint-disable-next-line react/prop-types
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("d");
    const email = params.get("e");

    const {password1} = this.state.data;
    const {password2} = this.state.data;

    if (password1 === password2 && token && email) {
      PocketUserService.resetPassword(email, token, password1, password2).then(
        (result) => {
          if (result) {
            // eslint-disable-next-line react/prop-types
            this.props.history.push({
              pathname: ROUTE_PATHS.login,
            });
          } else {
            this.setState({
              alertOverlay: {
                show: true,
                variant: "danger",
                message: "An error ocurred, please contact your administrator.",
              },
            });
          }
        }
      );
    } else{
      this.setState({
        alertOverlay: {
          show: true,
          variant: "danger",
          message: "One or more properties are missing or invalid.",
        },
      });
    }
  }

  render() {
    const {alertOverlay} = this.state;
    const schema = yup.object().shape({
      password1: yup
        .string()
        .min(8, VALIDATION_MESSAGES.MIN(8))
        .required(VALIDATION_MESSAGES.REQUIRED),
      password2: yup
        .string()
        .required(VALIDATION_MESSAGES.REQUIRED)
        .oneOf([yup.ref("password1"), null], "Passwords must match"),
    });

    return (
      <Container fluid id={"forgot-password-page"}>
        <Navbar />
        {!alertOverlay.show ? (
          <Row className="mt-1">
            <div id="main">
              <PocketBox iconUrl={"/assets/triangle.png"}>
                <h1 className="title-password">Reset password</h1>
                <Formik
                  validationSchema={schema}
                  onSubmit={(data) => {
                    this.setState({data});
                    this.handleSubmit();
                  }}
                  initialValues={this.state.data}
                  values={this.state.data}
                  validateOnChange={false}
                  validateOnBlur={false}
                  autoComplete="off"
                >
                  {({handleSubmit, handleChange, values, errors}) => (
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit} id={"main-form"}>
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password1"
                          placeholder="**************"
                          value={values.password1}
                          onChange={handleChange}
                          isInvalid={!!errors.password1}
                          className="passwordInput"
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
                          className="passwordInput"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password2}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        className="resetButton mt-4"
                        type="submit"
                        size="md"
                        variant="primary"
                      >
                        <span>Change Password</span>
                      </Button>
                    </Form>
                  )}
                </Formik>
              </PocketBox>
            </div>
          </Row>
        ) : (
          <Row>
            <Col lg={{span: 10, offset: 1}} md={{span: 6, offset: 2}}>
              <AppAlert
                variant={alertOverlay.variant}
                title={alertOverlay.message}
              />
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

export default ResetPassword;
