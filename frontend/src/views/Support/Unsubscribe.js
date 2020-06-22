import React, {Component} from "react";
import "../Support/SupportPages.scss";
import {withRouter} from "react-router-dom";
import {Container, Row, Button} from "react-bootstrap";
import Navbar from "../../core/components/Navbar";

class Unsubscribe extends Component {
  constructor(props, context) {
    super(props, context);

    this.validateUnsubscribe = this.validateUnsubscribe.bind(this);

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
    PocketUserService.subscribeUser(queryParam.d).then((result) => {
      if (result.success) {
        this.setState({email: result.data});
      } else {
        this.setState({
          alertOverlay: {
            show: true,
            variant: "danger", // TODO update this variant to non danger
            message: "You've been subscribed again.",
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

    if (queryParam === undefined || queryParam.d === undefined) {
      this.setState({
        alertOverlay: {show: true, variant: "danger", message: "Invalid URL"},
      });
      return;
    }

    PocketUserService.unsubscribeUser(queryParam.d).then((result) => {
      if (result.success) {
        this.setState({email: result.data});
      } else {
        this.setState({
          alertOverlay: {
            show: true,
            variant: "danger",
            message: "We couldn't find a corresponding email to unsbuscribe.",
          },
        });
      }
    });
  }

  render() {
    return (
      <Container fluid id="privacy-policy">
        <Navbar />

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
                onChange={this.validateSubscribe}
                size="sm"
                variant="primary"
                block
              >
                <span className="sign-up-btn">Subscribe again</span>
              </Button>
            </div>
          </Row>
        </div>
      </Container>
    );
  }
}

export default withRouter(Unsubscribe);
