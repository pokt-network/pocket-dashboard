import React, {Component} from "react";
import PropTypes from "prop-types";
import "./ResetPasswordEmail.scss";
import {Button, Col, Container, Row} from "react-bootstrap";
import Navbar from "../../../core/components/Navbar";
import {ROUTE_PATHS} from "../../../_routes";
import UnauthorizedAlert from "../../../core/components/UnauthorizedAlert";
import AppAlert from "../../../core/components/AppAlert";
import PocketBox from "../../../core/components/PocketBox/PocketBox";

class ResetPasswordEmail extends Component {
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

    this.pushToHome = this.pushToHome.bind(this);
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

  pushToHome() {
    const {email} = this.state.email;

    // eslint-disable-next-line react/prop-types
    this.props.history.push({
      pathname: ROUTE_PATHS.home,
      state: {email},
    });
  }

  render() {
    const {email, unauthorized, resentEmail} = this.state;

    /* eslint-enable jsx-a11y/alt-text */

    return (
      <Container fluid id="verify-email-page">
        <Navbar />
        {!unauthorized ? (
          <>
            <Row className="content justify-content-center">
              <div id="main">
                <PocketBox iconUrl={"/assets/circle.png"}>
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
                    CHECK YOUR INBOX <br />
                  </h1>
                  <p className="p-style-lg">
                    We have sent a link to reset your password to:
                  </p>
                  <h2 className="email-address mt-4">{email}</h2>

                  <p className="p-style-lg">
                    If you don&apos;t receive this message in a few minutes,
                    please make sure it was not sent to your spam folder.
                  </p>
                  <Button
                    className="button"
                    variant="primary"
                    size={"md"}
                    onClick={this.pushToHome}
                  >
                    <span className="button-label">Cancel</span>
                  </Button>
                </PocketBox>
              </div>
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

ResetPasswordEmail.propTypes = {
  email: PropTypes.string,
};

export default ResetPasswordEmail;
