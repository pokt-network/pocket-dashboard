import React, {Component} from "react";
import {Container, Row, Col} from "react-bootstrap";
import Navbar from "../../../core/components/Navbar";
import qs from "qs";
import AppAlert from "../../../core/components/AppAlert";
import PocketUserService from "../../../core/services/PocketUserService";

class VerifyChangedEmail extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      email: "",
      alertOverlay: {
        show: false,
        variant: "",
        message: "",
      },
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const queryParam = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });

    if (queryParam === undefined || queryParam.d === undefined) {
      this.setState({
        alertOverlay: {show: true, variant: "danger", message: "Invalid URL"},
      });
      return;
    }

    PocketUserService.validateToken(queryParam.d).then((result) => {
      if (result.success) {
        this.setState({email: result.data});
      } else {
        this.setState({
          alertOverlay: {
            show: true,
            variant: "danger",
            message:
              "Token has expired. Please resend your email confirmation.",
          },
        });
      }
    });

    // TODO: Verify new email, logout current user and redirect to login.
  }

  render() {
    const {alertOverlay} = this.state;

    return (
      <Container fluid>
        <Navbar />

        <Row className="content">
          <Col id="main" md={{span: 8, offset: 2}} lg={{span: 6, offset: 3}}>
            {alertOverlay.show && (
              <AppAlert
                variant={alertOverlay.variant}
                title={alertOverlay.message}
              />
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default VerifyChangedEmail;
