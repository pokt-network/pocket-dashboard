import BasePaymentProvider, {CardPaymentMethod, PaymentResult} from "./BasePaymentProvider";
import Stripe from "stripe";

const AMOUNT_CONVERT_NUMBER = 100;

class StripePaymentProvider extends BasePaymentProvider {

  constructor(paymentProviderConfiguration) {
    super(paymentProviderConfiguration);

    /** {Stripe} */
    this._stripeAPIClient = new Stripe(paymentProviderConfiguration.client_secret, paymentProviderConfiguration.options);

    this.retrieveCardPaymentMethod = this.retrieveCardPaymentMethod.bind(this);
    this.createPaymentIntent =  this.createPaymentIntent.bind(this);
  }

  async createPaymentIntent(type, currency, item, amount, description = "") {

    let paymentData = {
      amount: amount * AMOUNT_CONVERT_NUMBER,
      payment_method_types: [type],
      currency,
      metadata: {
        "pocket account": item.account,
        name: item.name,
        type: item.type,
        pokt: item.pokt
      }
    };

    if (description) {
      paymentData["description"] = description;
    }

    const paymentResultData = await this._stripeAPIClient.paymentIntents.create(paymentData);

    const date = new Date(paymentResultData.created * 1000);
    const resultAmount = paymentResultData.amount / AMOUNT_CONVERT_NUMBER;

    return new PaymentResult(paymentResultData.id, date, paymentResultData.client_secret, paymentResultData.currency, resultAmount);
  }

  async retrieveCardPaymentMethod(paymentMethodID) {
    const paymentMethodData = await this._stripeAPIClient.paymentMethods.retrieve(paymentMethodID);

    if (!paymentMethodData) {
      return null;
    }

    const {id, card, billing_details} = paymentMethodData;
    const {last4, exp_month, exp_year} = card;

    return new CardPaymentMethod(id, last4, exp_month, exp_year, billing_details);
  }

  async retrieveCardPaymentMethods(paymentMethodIDs) {
    const cardPaymentMethods = await paymentMethodIDs.map(this.retrieveCardPaymentMethod);

    return Promise.all(cardPaymentMethods);
  }
}

export default StripePaymentProvider;
