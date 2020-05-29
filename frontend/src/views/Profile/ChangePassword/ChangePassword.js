import React, {Component} from "react";
import "./ChangePassword.scss";
import {Col, Button, Form, Row} from "react-bootstrap";
import {Formik} from "formik";
import {validateYup, passwordChangeSchema} from "../../../_helpers";
import UserService from "../../../core/services/PocketUserService";
import AppAlert from "../../../core/components/AppAlert";
import SecurityQuestionModal from '../../../core/components/SecurityQuestionModal';

class ChangePassword extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.validate = this.validate.bind(this);

    this.min_password_length = 8;

    this.state = {
      securityQuestion: false,
      data: {
        oldPassword: "",
        password1: "",
        password2: "",
      },
      alert: {
        show: false,
        variant: "",
        text: "",
      },
    };
  }

  async validate(values) {
    let errors = {};
    let yupErr;

    yupErr = await validateYup(values, passwordChangeSchema);

    if (yupErr) {
      return yupErr;
    }

    const {email} = UserService.getUserInfo();

    const isOldPasswordValid = await UserService.verifyPassword(
      email, values.oldPassword
    );

    if (isOldPasswordValid) {
      if (values.password1 === values.oldPassword) {
        errors.password1 =
          "New password cannot be the same as the old password";
      }
    } else {
      errors.oldPassword = "Incorrect password";
    }

    return errors;
  }

  async handleChangePassword() {
    const {email} = UserService.getUserInfo();
    const {password1, password2} = this.state.data;

    const {success, data} = await UserService.changePassword(
      email, password1, password2
    );

    if (success) {
      this.setState({
        alert: {
          show: true,
          variant: "primary",
          text: "password successfully changed",
        },
      });
    } else {
      this.setState({
        alert: {
          show: true,
          variant: "danger",
          text: data.message,
        },
      });
    }
  }

  render() {
    const {alert, securityQuestion} = this.state;

    return (
      <Row id="general">
        <Col lg={{span: 10, offset: 1}} className="title-page">
          <div className="wrapper">
            {alert.show && (
              <AppAlert
                variant={alert.variant}
                title={alert.text}
                dismissible
                onClose={() => this.setState({alert: {show: false}})}
              />
            )}
            <h1>Change your Password</h1>
            <Formik
              validate={this.validate}
              onSubmit={(data) => {
                this.setState({data, securityQuestion: true});
              }}
              initialValues={this.state.data}
              values={this.state.data}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({handleSubmit, handleChange, values, errors}) => (
                <Form noValidate onSubmit={handleSubmit} id="main-form">
                  <Form.Group>
                    <Form.Label>Old password</Form.Label>
                    <Form.Control
                      name="oldPassword"
                      type="password"
                      value={values.oldPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.oldPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.oldPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password1"
                      value={values.password1}
                      onChange={handleChange}
                      isInvalid={!!errors.password1}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password1}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <Form.Group>
                    <Form.Label>Password Confirm</Form.Label>
                    <Form.Control
                      name="password2"
                      value={values.password2}
                      onChange={handleChange}
                      isInvalid={!!errors.password2}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password2}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <br />
                  <Button type="submit" variant="primary">
                    save
                  </Button>
                </Form>
              )}
            </Formik>
            {securityQuestion && (
          <SecurityQuestionModal
            show={securityQuestion}
            onClose={() => {
              this.setState({securityQuestion: false});
            }}
            // TODO: Implement change password
            onAfterValidation={this.handleChangePassword}
          />
        )}
          </div>
        </Col>
      </Row>
    );
  }
}

export default ChangePassword;
