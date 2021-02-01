import React, { Component } from "react";
import { CardCvcElement } from "@stripe/react-stripe-js";
import { PaymentInputStyle } from "./ComponentStyles";

class CardCVCNumberInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.elementOptions = {
      classes: {
        base: "payment-input card-cvc-number-input",
      },
      style: PaymentInputStyle,
      placeholder: "222",
    };
  }

  render() {
    return <CardCvcElement options={this.elementOptions} />;
  }
}

export default CardCVCNumberInput;
