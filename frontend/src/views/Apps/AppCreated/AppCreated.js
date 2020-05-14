import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Alert, Button, Col, Row} from "react-bootstrap";
import "./AppCreated.scss";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import ApplicationService from "../../../core/services/PocketApplicationService";
import Loader from "../../../core/components/Loader";
import {BOND_STATUS} from "../../../_constants";

class AppCreated extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      privateKey: "",
      address: "",
      stakedTokens: 0,
      maxRelays: 0,
      status: "",
      loading: true,
    };
  }

  async componentDidMount() {
    const {address, privateKey} = ApplicationService.getAppAInfo();

    const {networkData} = await ApplicationService.getApplication(address);

    if (networkData) {
      const {
        status,
        maxRelays,
        stakedTokens,
      } = networkData;

      this.setState({
        status,
        maxRelays,
        stakedTokens,
        address,
        privateKey,
        loading: false,
      });

      ApplicationService.removeAppInfoFromCache();
    }
  }

  render() {
    // TODO: Get POKT balance
    const {
      address,
      privateKey,
      stakedTokens,
      maxRelays,
      status,
      loading,
    } = this.state;

    const generalInfo = [
      {title: `${stakedTokens} POKT`, subtitle: "Stake tokens"},
      {title: BOND_STATUS[status], subtitle: "Stake status"},
      {title: maxRelays, subtitle: "Max Relays"},
    ];

    if (loading) {
      return <Loader/>;
    }

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
              <InfoCard title={card.title} subtitle={card.subtitle}/>
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
        <Link
          to={() => {
            const url = _getDashboardPath(DASHBOARD_PATHS.appDetail);

            return url.replace(":address", address);
          }}
        >
          <Button size="lg" variant="dark" className="float-right mt-2">
            Continue
          </Button>
        </Link>
      </div>
    );
  }
}

export default AppCreated;
