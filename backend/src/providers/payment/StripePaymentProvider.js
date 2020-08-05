import BasePaymentProvider, {CardPaymentMethod, PaymentResult} from "./BasePaymentProvider";
import Stripe from "stripe";

class StripePaymentProvider extends BasePaymentProvider {

  constructor(paymentProviderConfiguration) {
    super(paymentProviderConfiguration);

    /** {Stripe} */
    this._stripeAPIClient = new Stripe(paymentProviderConfiguration.client_secret, paymentProviderConfiguration.options);

    this.retrieveCardPaymentMethod = this.retrieveCardPaymentMethod.bind(this);
    this.createPaymentIntent = this.createPaymentIntent.bind(this);
  }

  async createPaymentIntent(userCustomerID, type, currency, item, amount, description = "") {

    let paymentData = {
      amount: amount,
      payment_method_types: [type],
      currency,
      metadata: {
        "pocket account": item.account,
        name: item.name,
        type: item.type,
        pokt: item.pokt
      },
      setup_future_usage: "on_session",
      customer: userCustomerID
    };

    if (description) {
      paymentData["description"] = description;
    }
    
    const paymentResultData = await this._stripeAPIClient.paymentIntents.create(paymentData);

    const date = new Date(paymentResultData.created * 1000);
    const resultAmount = paymentResultData.amount;

    return new PaymentResult(paymentResultData.id, date, paymentResultData.client_secret, paymentResultData.currency, resultAmount);
  }

  async retrieveCardPaymentMethod(paymentMethodID) {
    const paymentMethodData = await this._stripeAPIClient.paymentMethods.retrieve(paymentMethodID);

    if (!paymentMethodData) {
      return null;
    }

    const {id, card, billing_details} = paymentMethodData;
    const {brand, last4, exp_month, exp_year} = card;

    return new CardPaymentMethod(id, brand, last4, exp_month, exp_year, billing_details);
  }

  async retrieveCardPaymentMethods(paymentMethodIDs) {
    const cardPaymentMethods = await paymentMethodIDs.map(this.retrieveCardPaymentMethod);

    return Promise.all(cardPaymentMethods);
  }

  async createCustomer(user) {
    return await this._stripeAPIClient.customers.create({email: user});
  }

  async getCustomerCardPaymentMethods(customerID) {
    /** @type {{data:*[]}} */
    const request = await this._stripeAPIClient.paymentMethods.list({customer: customerID, type: "card"});

    if (!request.data) {
      return [];
    }

    return request.data.map(paymentMethodData => {

      const {id, card, billing_details} = paymentMethodData;
      const {brand, last4, exp_month, exp_year} = card;

      return new CardPaymentMethod(id, brand, last4, exp_month, exp_year, billing_details);
    });
  }
}

export default StripePaymentProvider;
