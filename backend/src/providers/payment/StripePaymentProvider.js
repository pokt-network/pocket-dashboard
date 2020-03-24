import BasePaymentProvider, {PaymentResult} from "./BasePaymentProvider";
import Stripe from "stripe";

const AMOUNT_CONVERT_NUMBER = 100;

class StripePaymentProvider extends BasePaymentProvider {

  constructor(paymentProviderConfiguration) {
    super(paymentProviderConfiguration);

    /** {Stripe} */
    this._stripeAPIClient = new Stripe(paymentProviderConfiguration.client_secret, paymentProviderConfiguration.options);
  }

  async makeIntentPayment(type, currency, amount, description, metadata = undefined, receipt = undefined) {

    let paymentData = {
      amount: amount * AMOUNT_CONVERT_NUMBER,
      payment_method_types: [type],
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
        exp_month: card.expirationDate.getMonth(),
        exp_year: card.expirationDate.getFullYear()
      }
    });
  }
}

export default StripePaymentProvider;
