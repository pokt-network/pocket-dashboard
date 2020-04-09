import React, {Component} from "react";
import PropTypes from "prop-types";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {Configurations} from "../../../_configuration";

const STRIPE_PROMISE = loadStripe(Configurations.payment.default.client_id);

class Payment extends Component {

  render() {
    return (
      <Elements stripe={STRIPE_PROMISE}>
        {this.props.children}
      </Elements>
    );
  }
}

Payment.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};


export default Payment;
