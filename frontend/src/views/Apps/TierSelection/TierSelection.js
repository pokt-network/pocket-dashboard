import React, { Component } from "react";
import { Button, Col, Row } from "react-bootstrap";
import ApplicationService from "../../../core/services/PocketApplicationService";
import "./TierSelection.scss";
import { _getDashboardPath, DASHBOARD_PATHS, ROUTE_PATHS } from "../../../_routes";
import { Link } from "react-router-dom";
import Loader from "../../../core/components/Loader";
import AppAlert from "../../../core/components/AppAlert";
import CustomTierModal from "./CustomTierModal";
import FreeTierModal from "./FreeTierModal";
import { CUSTOM_TIER_MODAL, FREE_TIER_MODAL } from "./constants";
import PocketClientService from "../../../core/services/PocketClientService";
import { Configurations } from "../../../_configuration";
import { BACKEND_ERRORS, DEFAULT_NETWORK_ERROR_MESSAGE } from "../../../_constants";

class TierSelection extends Component {
  constructor(props, context) {
    super(props, context);

    this.createFreeTierItem = this.createFreeTierItem.bind(this);
    this.handleHide = this.handleHide.bind(this);

    this.state = {
      [FREE_TIER_MODAL]: false,
      [CUSTOM_TIER_MODAL]: false,
      creatingFreeTier: false,
      errorMessage: "",
    };
  }

  async createFreeTierItem() {
    const {
      id,
      address,
      chains,
      passphrase
    } = ApplicationService.getApplicationInfo();

    const unlockedAccount = await PocketClientService.getUnlockedAccount(address, passphrase);
    const clientAddressHex = unlockedAccount.addressHex;

    const url = _getDashboardPath(
      DASHBOARD_PATHS.appDetail
    );

    const detail = url.replace(":id", id);
    const applicationLink = `${window.location.origin}${detail}`;

    const stakeAmount = Configurations.pocket_network.free_tier.stake_amount.toString();

    const stakeInformation = {
      client_address: clientAddressHex,
      chains: chains,
      stake_amount: stakeAmount
    };

    this.setState({ creatingFreeTier: true });

    const { success, name: errorType } = await ApplicationService.stakeFreeTierApplication(stakeInformation, applicationLink);

    if (success !== false) {
      const url = _getDashboardPath(DASHBOARD_PATHS.appDetail);
      const path = url.replace(":id", id);

      ApplicationService.removeAppInfoFromCache();

      // eslint-disable-next-line react/prop-types
      this.props.history.push({ pathname: path, state: { freeTierMsg: true } });
    } else {
      let errorMessage = "There was an error creating your free tier app.";

      if (errorType === BACKEND_ERRORS.NETWORK) {
        errorMessage = DEFAULT_NETWORK_ERROR_MESSAGE;
      }

      this.setState({
        creatingFreeTier: false,
        errorMessage: errorMessage,
      });
    }
  }

  handleHide(key) {
    this.setState({ [key]: !this.state[key] });
  }

  render() {
    const {
      freeTierModal,
      customTierModal,
      creatingFreeTier,
      errorMessage,
    } = this.state;

    if (creatingFreeTier) {
      return <Loader />;
    }

    return (
      <div className="tier-selection">
        {errorMessage && (
          <Row>
            <Col>
              <AppAlert
                title={errorMessage}
                variant="danger"
                dismissible
                onClose={() => this.setState({ errorMessage: "" })}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col className="page-title">
            <h1>Choose what is more convenient for your app</h1>
            <p className="info">
              Don&#39;t overpay for the infrastructure your app needs. Stake,
              and scale as your user base grows. Or start connecting to any
              blockchain with our Launch Offering plan capped at 1 Million Relays per day.
            </p>
          </Col>
        </Row>
        <Row className="tiers justify-content-center">
          <div className="tier">
            <div className="tier-title" style={{ textAlign: "center" }}>
              <h2>LAUNCH OFFERING</h2>
              <h5 style={{ fontSize: "16px", color: "black", fontWeight: "bold" }}>Get started for free</h5>
            </div>
            <ul>
              <li>Limited to the first 100 Apps to register</li>
              <li>Up to 1 Million relays per day</li>
              <li>Access AAT, but not ownership</li>
              <li>POKT stake is unavailable for transfers</li>
            </ul>
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <Button
              onClick={() => this.setState({ freeTierModal: true })}
              variant="link"
              className="cta"
              style={{ display: "inline-block" }}
            >
              How it works
            </Button>
            <span>
              Subject of Pocket {" "}
              <Link target="_blank" to={ROUTE_PATHS.termsOfService}>
                Terms and Conditions.
              </Link>
            </span>
            <Button
              onClick={() => this.createFreeTierItem()}
              disabled={false}
            >
              <span style={{ color: "white", fontWeight: "normal" }}>Join now</span>
            </Button>
          </div>
          <div className="tier custom-tier">
            <div>
              <div className="tier-title" style={{ textAlign: "center" }}>
                <h2>STAKE AND SCALE</h2>
                <h5 className="subtitle" style={{ fontSize: "16px", fontWeight: "bold" }}>Custom amount of relays</h5>
              </div>
              <ul>
                <li>AAT ownership</li>
                <li>Unstaked balance available for transfers</li>
                <li>Staked POKT is own by the user</li>
                <li>Scale-up as your application grows</li>
              </ul>
              {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
              <Button
                onClick={() => this.setState({ customTierModal: true })}
                variant="link"
                className="cta"
              >
                How it works
              </Button>
              <Link to={_getDashboardPath(DASHBOARD_PATHS.selectRelays)} style={{ marginTop: "10px" }} >
                <Button>
                  <span style={{ color: "white", fontWeight: "normal" }}>Stake</span>
                </Button>
              </Link>
            </div>
          </div>
        </Row>
        <CustomTierModal show={customTierModal} onHide={this.handleHide} />
        <FreeTierModal show={freeTierModal} onHide={this.handleHide} />
      </div>
    );
  }
}

export default TierSelection;
