import React, {Component} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import Navbar from "../../../core/components/Navbar";
import PocketBox from "../../../core/components/PocketBox/PocketBox";
import {Formik} from "formik";
import * as yup from "yup";
import {VALIDATION_MESSAGES} from "../../../_constants";
import PocketUserService from "../../../core/services/PocketUserService";
import "./ResetPassword.scss";

class ResetPassword extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      data: {
        password1: "",
        password2: "",
      },
    };
  }

  handleSubmit() {
    // TODO: Integrate to backend
    // eslint-disable-next-line react/prop-types
    const {email} = this.props.location.state;
    const {password1} = this.state.data;
    const {password2} = this.state.data;

    if (password1 === password2) {
      PocketUserService.changePassword(email, password1, password2);
    }
  }

  render() {
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
        <Row className="mt-1">
          <Col
            id={"main"}
            md={{span: 8, offset: 2}}
            lg={{span: 4, offset: 3}}
          >
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
              >
                {({handleSubmit, handleChange, values, errors}) => (
                  <Form noValidate onSubmit={handleSubmit} id={"main-form"}>
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
                      className="resetButton"
                      type="submit"
                      size="md"
                      variant="primary"
                    >
                      <span className="resetButtonText">Change Password</span>
                    </Button>
                  </Form>
                )}
              </Formik>
            </PocketBox>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ResetPassword;
