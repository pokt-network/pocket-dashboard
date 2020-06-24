import React, {Component} from "react";
import "../Support/SupportPages.scss";
import {withRouter} from "react-router-dom";
import {Container, Row, Button, Col} from "react-bootstrap";
import Navbar from "../../core/components/Navbar";
import qs from "qs";
import PocketUserService from "../../core/services/PocketUserService";
import AppAlert from "../../core/components/AppAlert";

class Unsubscribe extends Component {
  constructor(props, context) {
    super(props, context);

    this.validateSubscribe = this.validateSubscribe.bind(this);
    this.state = {
      email: "",
      alertOverlay: {
        show: false,
        variant: "",
        message: "",
      },
    };
  }

  validateSubscribe() {
    PocketUserService.subscribeUser(this.state.email).then((result) => {
      if (result) {
        this.setState({email: result.data});
        this.setState({
          alertOverlay: {
            show: true,
            variant: "success",
            message: "You've been subscribed to our mailing list again.",
          },
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
    });
  }

  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const queryParam = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });

    this.setState({email: queryParam.email});

    if (queryParam === undefined || queryParam.email === undefined) {
      this.setState({
        alertOverlay: {show: true, variant: "danger", message: "Invalid email"},
      });
      return;
    }

    PocketUserService.unsubscribeUser(queryParam.email).then((result) => {
      if (result) {
        this.setState({email: result.data});
      } else {
        this.setState({
          alertOverlay: {
            show: true,
            variant: "danger",
            message: "We couldn't find a corresponding email to unsubscribe.",
          },
        });
      }
    });
  }

  render() {
    const {alertOverlay} = this.state;

    return (
      <Container fluid id="privacy-policy">
        <Navbar />
        {!alertOverlay.show ? (
          <div className="wrapper">
            {/* eslint-disable-next-line react/prop-types */}

            <Row>
              <div className="address center-header unsubscribe">
                <p className="">
                  YOU&apos;VE SUCCESSFULLY BEEN
                  <br />
                  UNSUBSCRIBED FROM POCKET
                  <br />
                  NETWORK MESSAGES
                  <br />
                  <span className="primary-font-family center unsubscribe color-dark-gray-1">
                    Didn&apos;t mean to unsubscribe?
                  </span>
                </p>
                <Button
                  className="btn-size"
                  onClick={this.validateSubscribe}
                  size="sm"
                  variant="primary"
                  block
                >
                  <span className="sign-up-btn">Subscribe again</span>
                </Button>
              </div>
            </Row>
          </div>
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

export default withRouter(Unsubscribe);
