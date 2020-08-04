import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";
import {CUSTOM_TIER_MODAL} from "./constants";

class CustomTierModal extends Component {
  render() {
    const {show, onHide} = this.props;

    return (
      <Modal
        show={show}
        onHide={() => onHide(CUSTOM_TIER_MODAL)}
        animation={false}
        centered
        dialogClassName="tier-modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <h4>HOW IT WORKS? - STAKE AND SCALE</h4>
          <p>
            The Stake and Scale is a plan for the apps to be able to purchase the
            desired amount of throughput and scale up the application as it
            grows without overpaying for infrastructure.
          </p>
          <p>
            In the Stake and Scale plan, the staked POKT is completely owned and managed
            by the user as well as the AAT (Application Authentication Token).
            The Pocket protocol uses a staking mechanism, which lets individuals
            access a daily allocated API throughput in perpetuity in relation to
            their POKT stake.Purchase the relays you need. It’s recommended to
            give your application a comfortable throughput buffer to account for
            usage spikes as you will not be able to exceed your throughput
            limit.
          </p>
          <p>
            Keep in mind that the POKT in your account can only be transferred
            after meeting the minimum required bonding period of 21 days. Once
            your application goes through the unstaking process, it will be
            considered “Unstaked” and have its stake status updated. From this
            point, you’ll be able to transfer POKT or restake POKT.
          </p>
          <p>
            If you still have questions please take a look at our{" "}
            <a style={{fontWeight: "300", textDecoration: "none"}} rel="noopener noreferrer" target="_blank" href="https://dashboard.docs.pokt.network/docs/faq">FAQ</a>
          </p>
          <p className="subtitle">
            <b>Pocket Network</b>
          </p>
          <p>
            An Application Authentication Token (AAT) is needed to authorize the
            use of relay throughput. Providing your users with AAT’s dynamically
            allows you to control who you let use your Pocket Network bandwidth
            at your app discretion. (Note: a backend server is required for
            this).
          </p>
          <p>
            Please note: To discourage spamming the network, the bonding period
            of POKT tokens for both applications and nodes is a 21 day minimum.
          </p>

          <a style={{fontWeight: "300", textDecoration: "none"}} rel="noopener noreferrer" target="_blank" href="https://dashboard.docs.pokt.network/docs/faq">Please see our FAQ for additional information.</a>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => onHide(CUSTOM_TIER_MODAL)}>
            <span>Continue</span>
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

CustomTierModal.defaultProps = {
  show: false,
};

CustomTierModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
};

export default CustomTierModal;
