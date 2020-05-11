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
    const {handleAfterPayment} = this.props;

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
          // TODO: Show information to user in a proper way.
          handleAfterPayment({success: false, data: result.error});
        }

        if (result.paymentIntent) {
          // TODO: Show information to user in a proper way, and redirect to another path
          handleAfterPayment({success: true, data: result.paymentIntent.status});
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
  paymentIntentSecretID: PropTypes.string,
  handleAfterPayment: PropTypes.func,
};

export default SaveAndPayForm;
