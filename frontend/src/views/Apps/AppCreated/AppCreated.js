import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {Alert, Button, Col, Row} from "react-bootstrap";
import "./AppCreated.scss";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {PropTypes} from "prop-types";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";

class AppCreated extends Component {
  constructor(props, context) {
    super(props, context);

    this.appsPath = _getDashboardPath(DASHBOARD_PATHS.apps);
  }

  render() {
    if (this.props.location.state === undefined) {
      return <Redirect to={this.appsPath} />;
    }

    const {applicationData} = this.props.location.state;

    // TODO: Get POKT balance
    const {
      address,
      privateKey,
      stakedTokens,
      maxRelays,
      jailed,
      status,
    } = applicationData;

    let statusCapitalized = "";

    if (status) {
      statusCapitalized = status[0].toUpperCase() + status.slice(1);
    }

    const generalInfo = [
      {title: `${stakedTokens} POKT`, subtitle: "Stake tokens"},
      {title: statusCapitalized, subtitle: "Stake status"},
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
        <Button
          href={this.appsPath}
          size="lg"
          variant="dark"
          className="float-right mt-2"
        >
          Continue
        </Button>
      </div>
    );
  }
}

AppCreated.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      applicationData: PropTypes.shape({
        address: PropTypes.string,
        privateKey: PropTypes.string,
        stakedTokens: PropTypes.number,
        maxRelays: PropTypes.number,
        status: PropTypes.string,
        jailed: PropTypes.bool,
      }),
    }),
  }),
};

export default AppCreated;
