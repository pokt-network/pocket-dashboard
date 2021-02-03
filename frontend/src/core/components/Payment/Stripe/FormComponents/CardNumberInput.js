import React, { Component } from "react";
import { CardNumberElement } from "@stripe/react-stripe-js";
import { PaymentInputStyle } from "./ComponentStyles";

class CardNumberInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.elementOptions = {
      classes: {
        base: "payment-input card-number-input",
      },
      style: PaymentInputStyle,
      placeholder: "2222 2222 2222 2222",
    };
  }

  render() {
    return <CardNumberElement options={this.elementOptions} />;
  }
}

export default CardNumberInput;
