import React, {Component} from "react";
import {Alert, Button, Col, Row} from "react-bootstrap";
import "./AppCreated.scss";
import InfoCard from "../../../../../core/components/InfoCard/InfoCard";
import {PropTypes} from "prop-types";

// TODO: Move constants to constants file.
const BONDSTATUS = {
  0: "Bonded",
  1: "Unbonding",
  2: "Unbonded",
};

class AppCreated extends Component {
  state = {};
  render() {
    const {applicationData} = this.props;
    // TODO: Get POKT balance
    const {
      address,
      privateKey,
      stakedTokens,
      maxRelays,
      jailed,
      status,
    } = applicationData;

    const generalInfo = [
      {title: `${stakedTokens} POKT`, subtitle: "Stake tokens"},
      {title: BONDSTATUS[status], subtitle: "Stake status"},
      {title: maxRelays, subtitle: "Max Relays"},
      {title: jailed === true ? "YES" : "NO", subtitle: "Jailed"},
    ];

    return (
      <div id="app-created">
        <Row>
          <Col>
            <h1>Your application was created!</h1>
          </Col>
        </Row>

        <h2 className="d-flex mt-4">General Information</h2>
        <Row className="stats">
          {generalInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard title={card.title} subtitle={card.subtitle} />
            </Col>
          ))}
        </Row>
        <Row>
          <Col className="mt-4 info">
            <p>
              <span className="font-weight-bold">This is the private key.</span>{" "}
              You will never be able to change it.
            </p>
            <Alert variant="dark">{privateKey}</Alert>
          </Col>
        </Row>
        <Row>
          <Col className="mt-2 info">
            <p className="font-weight-bold">Address.</p>
            <Alert variant="dark">{address}</Alert>
          </Col>
        </Row>
        <Button size="lg" variant="dark" className="float-right mt-2">
          Continue
        </Button>
      </div>
    );
  }
}

AppCreated.propTypes = {
  applicationData: PropTypes.shape({
    address: PropTypes.string,
    privateKey: PropTypes.string,
    stakedTokens: PropTypes.number,
    maxRelays: PropTypes.string,
    status: PropTypes.number,
    jailed: PropTypes.bool,
  }),
};

export default AppCreated;
