import BasePaymentProvider, {PaymentResult} from "./BasePaymentProvider";
import Stripe from "stripe";
import {Configurations} from "../../_configuration";

const AMOUNT_CONVERT_NUMBER = 100;

export const StripeCardPaymentMethods = {
  unknown: "unknown",
  visa: "pm_card_visa",
  visa_debit: "pm_card_visa_debit",
  mastercard: "pm_card_mastercard",
  mastercard_debit: "pm_card_mastercard_debit",
  mastercard_prepaid: "pm_card_mastercard_prepaid",
  american_express: "pm_card_amex",
  discover: "pm_card_discover",
  diners: "pm_card_diners",
  jcb: "pm_card_jcb",
  union_pay: "pm_card_unionpay"
};

class StripePaymentProvider extends BasePaymentProvider {

  constructor() {
    super();
    /** {Stripe} */
    this._stripeAPIClient = new Stripe(Configurations.payment.default.client_secret, Configurations.payment.default.options);
  }


  async makePayment(paymentMethodType, currency, amount, description, metadata = undefined, receipt = undefined) {

    let paymentData = {
      payment_method_types: [paymentMethodType],
      amount: amount * AMOUNT_CONVERT_NUMBER,
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

    return new PaymentResult(new Date(paymentResultData.created * 1000), paymentResultData.client_secret, paymentResultData.currency, (paymentResultData.amount / AMOUNT_CONVERT_NUMBER));
  }


}

export default StripePaymentProvider;
