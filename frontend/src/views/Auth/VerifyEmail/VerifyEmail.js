import React, {Component} from "react";
import PropTypes from "prop-types";
import "./VerifyEmail.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import Navbar from "../../../core/components/Navbar";
import AppSteps from "../../../core/components/AppSteps/AppSteps";
import {ROUTE_PATHS} from "../../../_routes";
import {Link} from "react-router-dom";
import UserService from "../../../core/services/PocketUserService";
import UnauthorizedAlert from "../../../core/components/UnauthorizedAlert";
import AppAlert from "../../../core/components/AppAlert";

class VerifyEmail extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      email: "",
      unauthorized: false,
      resentEmail: false,

      alert: {
        show: false,
        variant: "",
        message: "",
      },
    };

    this.resendEmail = this.resendEmail.bind(this);
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    if (this.props.location.state === undefined) {
      this.setState({unauthorized: true});
      return;
    }
    // eslint-disable-next-line react/prop-types
    const {email} = this.props.location.state;

    this.setState({email});
  }

  resendEmail(e) {
    this.setState({resendEmail: false});
    const securityQuestionLinkPage = `${window.location.origin}${ROUTE_PATHS.security_questions}`;

    UserService.resendSignUpEmail(
      this.state.email, securityQuestionLinkPage
    ).then((result) => {
      this.setState({
        resentEmail: true,
        alert: {
          show: true,
          variant: "danger",
        },
      });
    });
  }

  render() {
    const {email, unauthorized, resentEmail} = this.state;

    /* eslint-disable jsx-a11y/alt-text */
    const icons = [
      <img key={0} src="/assets/user.svg" className="step-icon" />,
      <img key={1} src="/assets/mail.svg" className="step-icon" />,
      <img key={2} src="/assets/profile/key.svg" className="step-icon" />,
    ];
    /* eslint-enable jsx-a11y/alt-text */

    return (
      <Container fluid id="verify-email-page">
        <Navbar />
        {!unauthorized ? (
          <>
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
            <Row className="content">
              <Col
                id="main"
                md={{span: 8, offset: 2}}
                lg={{span: 5, offset: 4}}
              >
                {resentEmail && (
                  <AppAlert
                    variant={alert.variant}
                    dismissible
                    onClose={() => {
                      this.setState({resentEmail: false});
                    }}
                    title={<h4>An Email has been resent to your address</h4>}
                  />
                )}
                <h1>
                  We sent an email to this address <br />
                </h1>
                <h2 className="email-address mt-4">{email}</h2>
                <p>
                  <Link
                    className="font-weight-light"
                    to={ROUTE_PATHS.forgot_password}
                  >
                    This is not my email.
                  </Link>
                </p>

                <p className="p-style-lg">
                  Check your junk folder, be sure to mark it as not spam to
                  avoid any problems with notifications from dashboard.
                </p>
                <p className="p-style-md">Did you not receive it?</p>
                <Button
                  className="button"
                  variant="primary"
                  size={"md"}
                  onClick={this.resendEmail}
                >
                  <span className="button-label">Resend</span>
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col>
              <UnauthorizedAlert />
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

VerifyEmail.propTypes = {
  email: PropTypes.string,
};

export default VerifyEmail;
