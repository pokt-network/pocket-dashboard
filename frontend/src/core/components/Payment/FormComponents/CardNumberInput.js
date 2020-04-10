import React, {Component} from "react";
import {CardNumberElement} from "@stripe/react-stripe-js";
import {PaymentInputStyle} from "./ComponentStyles";

class CardNumberInput extends Component {

  constructor(props, context) {
    super(props, context);

    this.elementOptions = {
      classes: {
        base: "payment-input card-number-input"
      },
      style: {
        base: PaymentInputStyle
      },
      placeholder: ""
    };
  }

  render() {
    return <CardNumberElement options={this.elementOptions}/>;
  }
}

export default CardNumberInput;
