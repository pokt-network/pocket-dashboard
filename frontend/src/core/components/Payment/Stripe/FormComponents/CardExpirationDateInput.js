import React, {Component} from "react";
import {CardExpiryElement} from "@stripe/react-stripe-js";
import {PaymentInputStyle} from "./ComponentStyles";

class CardExpirationDateInput extends Component {

  constructor(props, context) {
    super(props, context);

    this.elementOptions = {
      classes: {
        base: "payment-input card-expiration-date-input"
      },
      style: PaymentInputStyle,
      placeholder: "2/22"
    };
  }

  render() {
    return <CardExpiryElement options={this.elementOptions}/>;
  }
}

export default CardExpirationDateInput;
