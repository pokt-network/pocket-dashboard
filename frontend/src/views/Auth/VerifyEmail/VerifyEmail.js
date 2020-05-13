/* eslint-disable jsx-a11y/alt-text */
import React, {Component} from "react";
import PropTypes from "prop-types";
import "./VerifyEmail.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import Navbar from "../../../core/components/Navbar";
import AppSteps from "../../../core/components/AppSteps/AppSteps";
import {ROUTE_PATHS} from "../../../_routes";
import {Link} from "react-router-dom";
import UserService from "../../../core/services/PocketUserService";

class VerifyEmail extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      email: "",
    };

    this.resendEmail = this.resendEmail.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    if (this.props.location.state === undefined) {
      // TODO: Show message on frontend
      console.log("Error: you are not authorized to do this action");
      return;
    }
    // eslint-disable-next-line react/prop-types
    const {email} = this.props.location.state;

    this.setState({email});
  }

  resendEmail(e) {
    const securityQuestionLinkPage = `${window.location.origin}${ROUTE_PATHS.security_questions}`;

    UserService.resendSignUpEmail(this.state.email, securityQuestionLinkPage)
      .then(result => {
        console.log(result);
      });
  }

  render() {
    const {email} = this.state;

    const icons = [
      <img key={0} src="/assets/user.svg" className="step-icon" />,
      <img key={1} src="/assets/mail.svg" className="step-icon" />,
      <img key={2} src="/assets/key.svg" className="step-icon" />,
    ];

    return (
      <Container fluid id="verify-email-page">
        <Navbar />
        <Row className="mt-5 mb-3">
          <Col lg={{span: 8, offset: 2}}>
            <AppSteps
              icons={icons}
              steps={[
                "Account Created",
                "Email Verified",
                "Security Questions",
              ]}
              current={1}
            />
          </Col>
        </Row>
        <Row></Row>
        <Row className="content">
          <Col id="main" md={{span: 8, offset: 2}} lg={{span: 5, offset: 4}}>
            <h1>
              We sent an email to this address <br />
            </h1>
            <h2 className="mt-4">{email}</h2>
            <p>
              <Link className="font-weight-light" to={"/todo"}>
                This is not my email.
              </Link>
            </p>

            <p>
              Check your junk folder, just to be sure to mark it as no spam to
              avoid any problems with notifications from dashboard
            </p>
            <p>Did you not receive it?</p>
            <Button
              className="font-weight-light pt-2 pb-2 pl-5 pr-5"
              variant="primary"
              size={"md"}
            >
              Resend
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

VerifyEmail.propTypes = {
  email: PropTypes.string,
};

export default VerifyEmail;
