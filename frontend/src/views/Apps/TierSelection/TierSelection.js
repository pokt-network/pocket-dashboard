import React, {Component} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import ApplicationService from "../../../core/services/PocketApplicationService";
import "./TierSelection.scss";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {Link} from "react-router-dom";

class TierSelection extends Component {
  constructor(props, context) {
    super(props, context);

    this.createFreeTierItem = this.createFreeTierItem.bind(this);

    this.state = {
      freeTierModal: false,
      customTierModal: false,
      agreeTerms: false,
    };
  }

  async createFreeTierItem() {
    const {privateKey, passphrase, chains} = ApplicationService.getApplicationInfo();
    const application = {privateKey, passphrase};

    const data = await ApplicationService.stakeFreeTierApplication(application, chains);

    ApplicationService.removeAppInfoFromCache();

    // TODO: Notify of errors on the frontend
    if (data !== false) {
      // eslint-disable-next-line react/prop-types
      this.props.history.push(_getDashboardPath(DASHBOARD_PATHS.appDetail));
    }
  }

  render() {
    const {freeTierModal, customTierModal, agreeTerms} = this.state;

    return (
      <div id="tier-selection" className="mt-4 ml-5">
        <Row>
          <Col id="titles">
            <h1>Choose what is more convenient for your app</h1>
            <p>
              Don&#39;t overpay for the infrastructure your app needs, stake and
              scale as your userbase grows or you can start connecting to any
              blockchain with our free tier.
            </p>
          </Col>
        </Row>
        <Row>
          <Col lg={{span: 5, offset: 1}}>
            <div className="tiers free mr-5">
              <div>
                <div className="tier-title m-3 mb-3">
                  <h2>Free</h2>
                  <h2 className="subtitle">tier</h2>
                </div>
                <ul>
                  <li>Limited to 1 Million relays per session</li>
                  <li>Access to AAT, but not ownership</li>
                  <li>Staked POKT is own by Pocket Network Inc</li>
                  <li>Unstake balance unavailable</li>
                </ul>
                {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                <Button
                  onClick={() => this.setState({freeTierModal: true})}
                  variant="link"
                  className="cta"
                >
                  How it works
                </Button>
                <br/>
                <Form.Check
                  checked={agreeTerms}
                  onChange={() => this.setState({agreeTerms: !agreeTerms})}
                  id="terms-checkbox"
                  type="checkbox"
                  label={
                    <p>
                      I agree to pocket Dashboard{" "}
                      <a href="/todo">Terms and Condititon</a>
                    </p>
                  }
                />
                <Button
                  onClick={() => this.createFreeTierItem()}
                  disabled={!agreeTerms}
                  size="md"
                  variant="dark"
                  className="ml-4 mt-3"
                >
                  Get Free Tier
                </Button>
                <br/>
              </div>
            </div>
          </Col>
          <Col lg={{span: 5}} className="right-tier">
            <div className="tiers custom mr-5">
              <div>
                <div className="tier-title m-3 mb-3">
                  <h2>Custom</h2>
                  <h2 className="subtitle">tier</h2>
                </div>
                <ul>
                  <li>Custom Relays per day</li>
                  <li>ATT ownership</li>
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
                <br/>
                <Link to={_getDashboardPath(DASHBOARD_PATHS.selectRelays)}>
                  <Button size="md" variant="primary" className="ml-4 mt-3">
                    Customize your tier
                  </Button>
                </Link>{" "}
                <br/>
              </div>
            </div>
          </Col>
        </Row>
        <Modal
          className="app-modal tier-modal"
          dialogClassName="modal-tier"
          show={customTierModal}
          onHide={() => this.setState({customTierModal: false})}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>How the custom tier works?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              The custom tier is a plan for the apps to be able to purchase the
              required amount of throughput and scale up the application as it
              grows without overpaying for infrastructure.{" "}
            </p>
            <p>
              In the custom tier, the staked POKT is completely owned and
              managed by the user as well as the MT (Application Authentication
              Token). The Pocket protocol uses a staking mechanism, which lets
              individuals essentially reserve a daily allocated API throughput
              in perpetuity in relation to their stake. Just purchase the relays
              you need.{" "}
            </p>
            <p>
              Keep in mind the POKT in your account could only be transferred
              after 21 days of staked state and after going trough unstake
              process and your app in Unbonded.{" "}
            </p>
            <p>
              If you still have questions please take a look at our{" "}
              <a href="/todo">FAQ.</a>
            </p>
            <p>Pocket Network</p>
            <p>
              An AAT o needed to authorize the use of throughput. Providing your
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              users with MT's dynamically allows you to control who you let use
              your Pocket Network bandwidth at your app discretion. (Note: a
              backend server is required for this).
            </p>
            <p>
              Please note: To discourage speculation, the unbonding period of
              tokens is 21 days.
            </p>

            <a href="/todo">Please see our FAQ for additional information.</a>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              className="pr-4 pl-4"
              onClick={() => this.setState({customTierModal: false})}
            >
              Agree
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          className="app-modal .modal-tier"
          show={freeTierModal}
          onHide={() => this.setState({freeTierModal: false})}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>How the free tier works.</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              The free tier is a plan for any app to receive free throughput
              limited to 9999 amount of relays for an unlimited time.
            </p>
            <p>
              In the free tier, Pocket Network Inc stakes on behalf of the
              customer and manages the staked POKT as well as the AAT
              (Application Authentication Token). This will allow any app to
              access the network and connect to any of the available chains for
              free.
            </p>
            <p>
              Once your app scales up you can unstake and transition to the
              Custom Tier to get the exact amount of throughput you need.
            </p>
            <p>
              If you still have questions please take a look at our{" "}
              <a href="/todo">FAQ.</a>
            </p>
            <p>Pocket Network</p>
            <p>
              In the free tier, Pocket Network Inc stakes on behalf of the user
              and manages the staked POKT and Application Authentication Token
              (MT). PNI reserves the right to revoke throughput at any time for
              violation of the Terms and Conditions PNI is not responsible for
              damage resulting from managing AATs or POKT.
            </p>
            <p>
              If you need additional bandwidth, you will always have the option
              to upgrade to a paid tier with additional control over your AAT
              and POKT.
            </p>
            <a href="/todo">Please see our FAQ for additional information</a>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              className="pr-4 pl-4"
              onClick={() => this.setState({freeTierModal: false})}
            >
              Agree
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default TierSelection;
