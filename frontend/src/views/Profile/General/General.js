import React, { Component } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import PocketUserService from "../../../core/services/PocketUserService";
import "./General.scss";
import { Formik } from "formik";
import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../../../_constants";
import UserService from "../../../core/services/PocketUserService";
import { ROUTE_PATHS } from "../../../_routes";
import AppAlert from "../../../core/components/AppAlert";
import SecurityQuestionModal from "../../../core/components/SecurityQuestionModal";

class General extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeUsernameEmail = this.handleChangeUsernameEmail.bind(this);

    this.state = {
      currentEmail: "",
      currentUsername: "",
      alert: { show: false, variant: "", text: "" },
      data: {
        username: "",
        email: "sss",
      },
      securityQuestion: false,
    };
  }

  async handleChangeUsernameEmail() {
    const { currentEmail, currentUsername } = this.state;
    const { username, email } = this.state.data;
    let changedEmail = false;
    let changedUsername = false;

    // TODO: Add change email security question answer page.
    if (currentEmail !== email) {
      const answerSecurityQuestionLinkPage = `${window.location.origin}${ROUTE_PATHS.security_questions}`;

      const { success, data } = await UserService.changeEmail(
        currentEmail, email, answerSecurityQuestionLinkPage
      );

      if (success) {
        changedEmail = true;
      } else {
        this.setState({
          alert: {
            show: true,
            variant: "danger",
            text: `${data.message}. No changes were saved`,
          },
        });
        return;
      }
    }

    if (currentUsername !== username) {
      const { email } = UserService.getUserInfo();
      const { success, data } = await UserService.changeUsername(email, username);

      if (success) {
        changedUsername = true;
      } else {
        this.setState({
          alert: {
            show: true,
            variant: "danger",
            text: `${data.message}. No changes were saved`,
          },
        });
        return;
      }
    }

    if (changedEmail && changedUsername) {
      this.setState({
        alert: {
          show: true,
          variant: "primary",
          text:
            "Email and username succesfully changed. Check your new email for instructions",
        },
      });
    } else if (changedEmail) {
      this.setState({
        alert: {
          show: true,
          variant: "primary",
          text:
            "Email succesfully changed. Check your new email for instructions",
        },
      });
    } else if (changedUsername) {
      this.setState({
        alert: {
          show: true,
          variant: "primary",
          text: "Username succesfully changed.",
        },
      });
    }
  }

  componentDidMount() {
    const { name: username, email } = PocketUserService.getUserInfo();

    this.setState({
      currentEmail: email,
      currentUsername: username,
      data: { username, email },
    });
  }

  handleChange({ currentTarget: input }) {
    const data = { ...this.state.data };

    data[input.name] = input.value;
    this.setState({ data });
  }

  render() {
    const { alert, securityQuestion } = this.state;

    const schema = yup.object().shape({
      username: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
      email: yup
        .string()
        .email(VALIDATION_MESSAGES.EMAIL)
        .required(VALIDATION_MESSAGES.REQUIRED),
    });

    return (
      <>
        <Row id="general">
          <Col lg={{ span: 10, offset: 1 }} className="title-page">
            <div className="wrapper">
              {alert.show && (
                <AppAlert
                  variant={alert.variant}
                  title={alert.text}
                  dismissible
                  onClose={() => this.setState({ alert: { show: false } })}
                />
              )}
              <h1>General Information</h1>
              <Formik
                enableReinitialize
                validationSchema={schema}
                onSubmit={(data) => {
                  const { currentEmail } = this.state;

                  this.setState({ data });
                  currentEmail === data.email
                    ? this.handleChangeUsernameEmail()
                    : this.setState({ securityQuestion: true });
                }}
                initialValues={this.state.data}
                values={this.state.data}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({ handleSubmit, handleChange, values, errors }) => (
                  <Form noValidate onSubmit={handleSubmit} id="main-form">
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        isInvalid={!!errors.username}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <br />
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
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
                    this.setState({ securityQuestion: false });
                  }}
                  onAfterValidation={this.handleChangeUsernameEmail}
                />
              )}
            </div>
          </Col>
        </Row>
      </>
    );
  }
}

export default General;
