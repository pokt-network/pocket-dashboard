import BaseService from "./BaseService";
import {get_default_payment_provider} from "../providers/payment";
import {PaymentCurrencies, PaymentResult} from "../providers/payment/BasePaymentProvider";


export default class PaymentService extends BaseService {

  constructor() {
    super();

    this._paymentProvider = get_default_payment_provider();
  }

  /**
   * Create an payment intent using the payment provider.
   *
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {number} amount Amount intended to be collected by this payment.
   * @param {string} to For what is the payment (Apps or Node).
   *
   * @returns {Promise<PaymentResult>} A payment result of intent.
   * @private
   * @async
   */
  async __createPocketPaymentIntent(type, currency, amount, to) {
    const description = "";

    return this._paymentProvider.createPaymentIntent(type, currency, amount, description);
  }

  /**
   * Validate payment data.
   *
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {number} amount Amount intended to be collected by this payment.
   *
   * @returns {boolean} True is validation is success.
   * @private
   * @throws Error if validation fails.
   */
  __validateData(type, currency, amount) {
    if (!type) {
      throw Error("Type is required");
    }

    if (!currency) {
      throw Error("Currency is required");
    }

    if (amount === 0) {
      throw Error("Amount is invalid");
    }

    return true;
  }

  /**
   *  Get available currencies.
   *
   * @returns {string[]} List of currencies.
   */
  getAvailableCurrencies() {
    return PaymentCurrencies.values();
  }

  /**
   * Create an payment intent for application.
   *
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {number} amount Amount intended to be collected by this payment.
   *
   * @returns {Promise<PaymentResult | boolean>} A payment result of intent.
   * @throws Error if validation fails.
   * @async
   */
  async createPoktPaymentIntentForApps(type, currency, amount) {

    this.__validateData(type, currency, amount);

    return this.__createPocketPaymentIntent(type, currency, amount, "apps");
  }


  async createPoktPaymentForNodes() {
  }

  async getPaymentHistory() {
  }
}
