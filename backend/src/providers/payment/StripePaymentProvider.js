import BasePaymentProvider, {PaymentResult} from "./BasePaymentProvider";
import Stripe from "stripe";

const AMOUNT_CONVERT_NUMBER = 100;

class StripePaymentProvider extends BasePaymentProvider {

  constructor(paymentProviderConfiguration) {
    super(paymentProviderConfiguration);

    /** {Stripe} */
    this._stripeAPIClient = new Stripe(paymentProviderConfiguration.client_secret, paymentProviderConfiguration.options);
  }

  async createPaymentIntent(type, currency, amount, description) {

    let paymentData = {
      amount: amount * AMOUNT_CONVERT_NUMBER,
      payment_method_types: [type],
      currency,
      description
    };

    const paymentResultData = await this._stripeAPIClient.paymentIntents.create(paymentData);

    const date = new Date(paymentResultData.created * 1000);
    const resultAmount = paymentResultData.amount / AMOUNT_CONVERT_NUMBER;

    return new PaymentResult(paymentResultData.id, date, paymentResultData.client_secret, paymentResultData.currency, resultAmount);
  }
}

export default StripePaymentProvider;
