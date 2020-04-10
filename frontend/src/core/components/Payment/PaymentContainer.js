import React, {Component} from "react";
import PropTypes from "prop-types";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {Configurations} from "../../../_configuration";

const STRIPE_PROMISE = loadStripe(Configurations.payment.default.client_id);

class PaymentContainer extends Component {

  render() {
    return (
      <div className={"payment-container"}>
        <Elements stripe={STRIPE_PROMISE}>
          {this.props.children}
        </Elements>
      </div>
    );
  }
}

PaymentContainer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};


export default PaymentContainer;
