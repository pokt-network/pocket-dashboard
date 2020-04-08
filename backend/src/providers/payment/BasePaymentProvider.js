export const PaymentCurrencies = {
  usd: "usd"
};

export const PaymentTypes = {
  card: "card"
};

export const CardBrands = {
  unknown: "Unknown",
  visa: "Visa",
  mastercard: "Mastercard",
  american_express: "American Express",
  discover: "Discover",
  diners_club: "Diners Club",
  jcb: "JCB",
  union_pay: "UnionPay"
};

export class PaymentRecipient {

  /**
   * @param {string} name Name of Recipient.
   * @param {string} [email] Email address that the receipt for the resulting payment will be sent to.
   * @param {string} [number] Number of Recipient.
   */
  constructor(name, email, number) {
    Object.assign(this, {name, email, number});
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
    Object.assign(this, {createdDate, amount, currency, paymentNumber});
  }
}

export class PaymentCard {

  /**
   * @param {string} brandName Brand name.
   * @param {string} number Number of card.
   * @param {string} cvc CVC of card.
   * @param {Date} expirationDate Expiration expirationDate of card.
   */
  constructor(brandName, number, cvc, expirationDate) {
    Object.assign(this, {brandName, number, cvc, expirationDate});
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
   * Make a intent of payment.
   *
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {number} amount Amount intended to be collected by this payment.
   * @param {string} description An arbitrary string attached to the object. Often useful for displaying to users.
   * @param {object} [metadata] Set of key-value pairs that you can attach to an object.
   * @param {PaymentRecipient} [receipt] Payment receipt.
   *
   * @returns {Promise<PaymentResult>} Payment result.
   * @async
   * @abstract
   */
  async makeIntentPayment(type, currency, amount, description, metadata = undefined, receipt = undefined) {
  }

  /**
   * Create card payment method.
   *
   * @param {PaymentCard} card PaymentCard to create a payment method.
   *
   * @returns {Promise<*>} A card payment method.
   * @async
   * @abstract
   */
  async createCardPaymentMethod(card) {
  }
}
