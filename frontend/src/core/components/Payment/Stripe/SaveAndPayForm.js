import React, {Component} from "react";
import "../Payment.scss";
import PropTypes from "prop-types";
import PocketStripePaymentService from "../../../services/PocketStripePaymentService";
import NewCardForm from "./NewCardForm";

class SaveAndPayForm extends Component {


  constructor(props, context) {
    super(props, context);

    this.handleSaveAndPayMethod = this.handleSaveAndPayMethod.bind(this);
  }


  handleSaveAndPayMethod(e, formData, stripe) {
    e.preventDefault();

    const {paymentIntentSecretID} = this.props;
    const {card, cardHolderName, billingAddressLine1, zipCode, country} = formData;
    const billingDetails = {
      name: cardHolderName,
      address: {
        line1: billingAddressLine1,
        postal_code: zipCode,
        country
      }
    };

    PocketStripePaymentService.confirmPaymentWithNewCard(stripe, paymentIntentSecretID, card, billingDetails)
      .then(result => {
        if (result.error) {
          console.log(result.error.message);
        }

        if (result.paymentIntent) {
          console.log(result.paymentIntent.status);
        }
      });
  }

  render() {
    return (
      <NewCardForm actionButtonName={"Save and Pay"} formActionHandler={this.handleSaveAndPayMethod}/>
    );
  }
}

SaveAndPayForm.propTypes = {
  paymentIntentSecretID: PropTypes.string
};

export default SaveAndPayForm;
