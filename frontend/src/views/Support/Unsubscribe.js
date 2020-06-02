import React, {Component} from "react";
import "../Support/SupportPages.scss";
import {withRouter} from "react-router-dom";
import {Container, Row, Button} from "react-bootstrap";
import Navbar from "../../core/components/Navbar";

class Unsubscribe extends Component {
  state = {};
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
              <Button className="btn-size " size="sm" variant="primary" block>
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
