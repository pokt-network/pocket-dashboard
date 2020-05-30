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
          <h4>How the custom tier works?</h4>
          <p>
            The custom tier is a plan for the apps to be able to purchase the
            required amount of throughput and scale up the application as it
            grows without overpaying for infrastructure.
          </p>
          <p>
            In the custom tier, the staked POKT is completely owned and managed
            by the user as well as the AAT (Application Authentication Token).
            The Pocket protocol uses a staking mechanism, which lets individuals
            essentially reserve a daily allocated API throughput in perpetuity
            in relation to their stake. Just purchase the relays you need.
          </p>
          <p>
            Keep in mind the POKT in your account could only be transferred
            after 21 days of staked state and after going trough unstake process
            and your app in Unstaked.{" "}
          </p>
          <p>
            If you still have questions please take a look at our{" "}
            <a href="/todo">FAQ.</a>
          </p>
          <p className="subtitle">
            <b>Pocket Network</b>
          </p>
          <p>
            An AAT is needed to authorize the use of throughput. Providing your
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            users with AAT's dynamically allows you to control who you let use
            your Pocket Network bandwidth at your app discretion. (Note: a
            backend server is required for this).
          </p>
          <p>
            Please note: To discourage speculation, the Unstaking period of
            tokens is 21 days.
          </p>

          <a href="/todo">Please see our FAQ for additional information.</a>
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
