import BasePaymentProvider, {PaymentResult} from "./BasePaymentProvider";
import Stripe from "stripe";
import {Configurations} from "../../_configuration";

const AMOUNT_CONVERT_NUMBER = 100;

class StripePaymentProvider extends BasePaymentProvider {

  constructor() {
    super();
    /** {Stripe} */
    this._stripeAPIClient = new Stripe(Configurations.payment.default.client_secret, Configurations.payment.default.options);
  }

  async makeCardPayment(currency, amount, description, metadata = undefined, receipt = undefined) {

    let paymentData = {
      amount: amount * AMOUNT_CONVERT_NUMBER,
      payment_method_types: ["card"],
      currency,
      description
    };

    if (metadata) {
      paymentData["metadata"] = metadata;
    }

    if (receipt) {
      paymentData["receipt_email"] = receipt.email;
      paymentData["receipt_number"] = receipt.number;
    }

    const paymentResultData = await this._stripeAPIClient.paymentIntents.create(paymentData);

    const date = new Date(paymentResultData.created * 1000);
    const resultAmount = paymentResultData.amount / AMOUNT_CONVERT_NUMBER;

    return new PaymentResult(paymentResultData.id, date, paymentResultData.client_secret, paymentResultData.currency, resultAmount);
  }

  async createCardPaymentMethod(card) {
    return await this._stripeAPIClient.paymentMethods.create({
      type: "card",
      card: {
        number: card.number,
        cvc: card.cvc,
        exp_month: card.date.getMonth(),
        exp_year: card.date.getFullYear()
      }
    });
  }
}

export default StripePaymentProvider;
