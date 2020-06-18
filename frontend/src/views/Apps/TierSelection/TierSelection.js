import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import ApplicationService from "../../../core/services/PocketApplicationService";
import "./TierSelection.scss";
import {_getDashboardPath, DASHBOARD_PATHS, ROUTE_PATHS} from "../../../_routes";
import {Link} from "react-router-dom";
import Loader from "../../../core/components/Loader";
import AppAlert from "../../../core/components/AppAlert";
import CustomTierModal from "./CustomTierModal";
import FreeTierModal from "./FreeTierModal";
import {CUSTOM_TIER_MODAL, FREE_TIER_MODAL} from "./constants";
import PocketClientService from "../../../core/services/PocketClientService";

class TierSelection extends Component {
  constructor(props, context) {
    super(props, context);

    this.createFreeTierItem = this.createFreeTierItem.bind(this);
    this.handleHide = this.handleHide.bind(this);

    this.state = {
      [FREE_TIER_MODAL]: false,
      [CUSTOM_TIER_MODAL]: false,
      agreeTerms: false,
      creatingFreeTier: false,
      errorMessage: "",
    };
  }

  async createFreeTierItem() {
    const {
      passphrase,
      chains,
      address,
    } = ApplicationService.getApplicationInfo();

    const unlockedAccount = await PocketClientService.getUnlockedAccount(address);
    const clientAddressHex = unlockedAccount.addressHex;
    const clientPubKeyHex = unlockedAccount.publicKey.toString("hex");

    this.setState({creatingFreeTier: true});

    const data = await ApplicationService.stakeFreeTierApplication(clientAddressHex, clientPubKeyHex);

    if (data !== false) {
      const url = _getDashboardPath(DASHBOARD_PATHS.appDetail);
      const path = url.replace(":address", address);

      ApplicationService.removeAppInfoFromCache();

      // eslint-disable-next-line react/prop-types
      this.props.history.push({pathname: path, state: {freeTierMsg: true}});
    } else {
      this.setState({
        creatingFreeTier: false,
        errorMessage: "There was an error creating your free tier app.",
      });
    }
  }

  handleHide(key) {
    this.setState({[key]: !this.state[key]});
  }

  render() {
    const {
      freeTierModal,
      customTierModal,
      agreeTerms,
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
                onClose={() => this.setState({errorMessage: ""})}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col className="page-title">
            <h1>Choose what is more convenient for your app</h1>
            <p className="info">
              Don&#39;t overpay for the infrastructure your app needs, stake,
              and scale as your user base grows or you can start connecting to
              any blockchain with our free tier.
            </p>
          </Col>
        </Row>
        <Row className="tiers justify-content-center">
          <div className="tier">
            <div className="tier-title">
              <h2>Free</h2>
              <h2 className="subtitle">tier</h2>
            </div>
            <ul>
              <li>Limited to 1 Million Relays per Day</li>
              <li>Access to AAT, but not ownership</li>
              <li>Stake POKT is managed by Pocket Network Inc.</li>
              <li>Unstake balance unavailable for transfers</li>
            </ul>
            {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
            <Button
              onClick={() => this.setState({freeTierModal: true})}
              variant="link"
              className="cta"
            >
              How it works
            </Button>
            <Form.Check
              checked={agreeTerms}
              onChange={() => this.setState({agreeTerms: !agreeTerms})}
              className="terms-checkbox"
              type="checkbox"
              label={
                <span>
                  I agree to Pocket Dashboard{" "}
                  <Link to={ROUTE_PATHS.termsOfService}>
                    Terms and Conditions.
                  </Link>
                </span>
              }
            />
            <Button
              onClick={() => this.createFreeTierItem()}
              disabled={!agreeTerms}
            >
              <span>Get Free Tier</span>
            </Button>
          </div>
          <div className="tier custom-tier">
            <div>
              <div className="tier-title">
                <h2>Custom</h2>
                <h2 className="subtitle">tier</h2>
              </div>
              <ul>
                <li>Custom Relays per Day</li>
                <li>AAT ownership</li>
                <li>Unstake balance available for transfers</li>
                <li>Staked POKT is own by the user</li>
              </ul>
              {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
              <Button
                onClick={() => this.setState({customTierModal: true})}
                variant="link"
                className="cta"
              >
                How it works
              </Button>
              <Link to={_getDashboardPath(DASHBOARD_PATHS.selectRelays)}>
                <Button>
                  <span>Get Custom Tier</span>
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
