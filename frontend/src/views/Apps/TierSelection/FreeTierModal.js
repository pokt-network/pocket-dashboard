import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";
import {FREE_TIER_MODAL} from "./constants";
import {Link} from "react-router-dom";
import {
  ROUTE_PATHS,
} from "../../../_routes";

class FreeTierModal extends Component {
  render() {
    const {show, onHide} = this.props;

    return (
      <Modal
        show={show}
        onHide={() => onHide(FREE_TIER_MODAL)}
        animation={false}
        centered
        dialogClassName="tier-modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
        <h4>HOW IT WORKS? - LAUNCH OFFERING</h4>
          <p>
            In the Mainnet Launch Offering, Pocket Network Inc stakes on behalf of the customer and manages
            the staked POKT as well as the AAT (Application Authentication Token). This will allow any app to access
            the network and connect to any of the available chains for free.
          </p>
          <p>
            Once your app scales up you can unstake and transition to the Stake and Scale plan to get the exact amount of
            throughput you need. If you still have questions take a look at our <a style={{fontWeight: "300", textDecoration: "none"}} rel="noopener noreferrer" target="_blank" href="https://dashboard.docs.pokt.network/docs/faq">FAQ</a>.
          </p>
          <p className="subtitle">
            <b>Pocket Network</b>
          </p>
          <p>
            In the Mainnet Launch Offering, Pocket Network Inc stakes on behalf of the app and manages the staked POKT and Application
            Authentication Token (AAT). PNI reserves the right to revoke throughput at any time for violation of the <Link style={{fontWeight: "300", textDecoration: "none"}} rel="noopener noreferrer" target="_blank" to={ROUTE_PATHS.termsOfService}>Terms of Use</Link>.
          </p>
          <p>Cases that may result in revocation of AAT include:</p>
          <ul className="violation-list">
            <li>Usage falls below 50,000 daily relays for over 3 months.</li>
            <li>User is deemed to be using a fraudulent application or attacking the network.</li>
            <li>User is exploiting the offering to run multiple free accounts.</li>
          </ul>
          <p>
            After one year of service, PNI will revisit continuning this service for all.<br/>
            PNI is not responsible for damage resulting from managing AATs or POKT.
          </p>
          <p>
            If you need additional bandwidth, you will always have the option to upgrade to a paid tier with additional control over your AAT and POKT.<br/>
            If you are expecting rapid growth of your application, we suggest preparing for the surge by setting up the Stake and Scale paid tier so you don&apos;t experience downtime due to exhausting your available relays.
          </p>
          <a style={{fontWeight: "300", textDecoration: "none"}} rel="noopener noreferrer" target="_blank" href="https://dashboard.docs.pokt.network/docs/faq">Please see our FAQ for additional information.</a>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => onHide(FREE_TIER_MODAL)}>
            <span>Continue</span>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

FreeTierModal.defaultProps = {
  show: false,
};

FreeTierModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
};

export default FreeTierModal;
