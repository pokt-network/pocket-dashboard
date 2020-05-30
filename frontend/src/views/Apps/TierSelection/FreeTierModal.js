import React, {Component} from "react";
import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";
import {FREE_TIER_MODAL} from "./constants";

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
          <h4>How the free tier works?</h4>
          <p>
            The free tier is a plan for any app to receive free throughput
            limited to 1 Million Relays per Day.
          </p>
          <p>
            In the free tier, Pocket Network Inc stakes on behalf of the
            customer and manages the staked POKT as well as the AAT (Application
            Authentication Token). This will allow any app to access the network
            and connect to any of the available chains for free.
          </p>
          <p>
            Once your app scales up you can unstake and transition to the Custom
            Tier to get the exact amount of throughput you need.
          </p>
          <p>
            If you still have questions please take a look at our{" "}
            <a href="/todo">FAQ.</a>
          </p>
          <p className="subtitle">
            <b>Pocket Network</b>
          </p>
          <p>
            In the free tier, Pocket Network Inc stakes on behalf of the user
            and manages the staked POKT and Application Authentication Token
            (AAT). PNI reserves the right to revoke throughput at any time for
            violation of the Terms and Conditions. PNI is not responsible for
            damage resulting from managing AATs or POKT.
          </p>
          <p>
            If you need additional bandwidth, you will always have the option to
            upgrade to a paid tier with additional control over your AAT and
            POKT.
          </p>
          <a href="/todo">Please see our FAQ for additional information.</a>
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
