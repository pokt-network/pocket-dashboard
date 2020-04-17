export const PaymentCurrencies = {
  usd: "usd"
};

export const PaymentTypes = {
  card: "card"
};

export class CardPaymentMethod {

  /**
   * @param {string} id ID of card payment method.
   * @param {string} lastDigits Last digits of card.
   * @param {number} expirationMonth Expiration month.
   * @param {number} expirationYear Expiration year.
   * @param {object} billingDetails Billing details.
   */
  constructor(id, lastDigits, expirationMonth, expirationYear, billingDetails) {
    Object.assign(this, {id, lastDigits, expirationMonth, expirationYear, billingDetails});
  }
}

export class PaymentResult {

  /**
   * @param {string} id ID of payment.
   * @param {Date} createdDate Date of creation of payment.
   * @param {string} paymentNumber Confirmation number of payment.
   * @param {string} currency Currency of payment.
   * @param {number} amount Amount of payment.
   */
  constructor(id, createdDate, paymentNumber, currency, amount) {
    Object.assign(this, {id, createdDate, amount, currency, paymentNumber});
  }
}

export class Payment {

  /**
   * Validate payment data.
   *
   * @param {object} paymentData Payment data to validate.
   * @param {string} paymentData.type Type of payment.
   * @param {string} paymentData.currency Three-letter ISO currency code, in lowercase.
   * @param {*} paymentData.item Item to pay.
   * @param {number} paymentData.amount Amount intended to be collected by this payment.
   *
   * @returns {boolean} True is validation is success.
   * @throws Error if validation fails.
   */
  static validate(paymentData) {

    if (!paymentData.type) {
      throw Error("Type is required");
    }

    if (!paymentData.currency) {
      throw Error("Currency is required");
    }

    if (paymentData.amount === 0) {
      throw Error("Amount is invalid");
    }

    if (!paymentData.item) {
      throw Error("Item is required");
    } else {

      if (!paymentData.item.account) {
        throw Error("Item account is required");
      }

      if (!paymentData.item.name) {
        throw Error("Item name is required");
      }

      if (!paymentData.item.pokt) {
        throw Error("Item pokt is required");
      }
    }

    return true;
  }
}

export default class BasePaymentProvider {

  /**
   * @param {object} paymentProviderConfiguration Payment provider configuration.
   * @param {string} paymentProviderConfiguration.client_id Client ID of Payment provider.
   * @param {string} paymentProviderConfiguration.client_secret Client secret of Payment provider.
   * @param {object} paymentProviderConfiguration.options Extra Options of payment provider.
   */
  constructor(paymentProviderConfiguration) {
    this._paymentProviderConfiguration = paymentProviderConfiguration;
  }

  /**
   * Create an intent of payment.
   *
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {*} item Item to pay.
   * @param {number} amount Amount intended to be collected by this payment.
   * @param {string} description An arbitrary string attached to the object. Often useful for displaying to users.
   *
   * @returns {Promise<PaymentResult>} Payment result.
   * @async
   * @abstract
   */
  async createPaymentIntent(type, currency, item, amount, description) {
  }

  /**
   * Retrieve card payment method data.
   *
   * @param {string} paymentMethodID Card payment method ID.
   *
   * @returns {Promise<CardPaymentMethod>} Card payment method.
   * @async
   * @abstract
   */
  async retrieveCardPaymentMethod(paymentMethodID) {
  }

  /**
   * Retrieve list of card payment method data.
   *
   * @param {string[]} paymentMethodIDs Card payment method IDs.
   *
   * @returns {Promise<CardPaymentMethod[]>} List of card payment method.
   * @async
   * @abstract
   */
  async retrieveCardPaymentMethods(paymentMethodIDs) {
  }
}
