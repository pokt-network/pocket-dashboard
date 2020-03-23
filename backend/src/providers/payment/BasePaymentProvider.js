export const PaymentMethodTypes = {
  card: "card"
};

export const PaymentCurrencies = {
  usd: "usd"
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
   * @param {Date} createdDate Date of creation of payment.
   * @param {string} paymentNumber Confirmation number of payment.
   * @param {string} currency Currency of payment.
   * @param {number} amount Amount of payment.
   */
  constructor(createdDate, paymentNumber, currency, amount) {
    Object.assign(this, {createdDate, amount, currency, paymentNumber});
  }
}

export class Card {

  /**
   * @param {string} type Type of card.
   * @param {string} brandName Brand name.
   * @param {string} number Number of card.
   * @param {number} cvc CVC of card.
   * @param {Date} date Expiration date of card.
   */
  constructor(type, brandName, number, cvc, date) {
    Object.assign(this, {type, brandName, number, cvc, date});
  }
}

class PaymentMethod {

  /**
   * @param {string} method paymentMethod ID of the payment method (a PaymentMethod, Card, or compatible Source object) to attach to this Payment.
   * @param {string} number Number of payment method.
   */
  constructor(method, number) {
    Object.assign(this, {method, number});
  }
}

export class CardPaymentMethod extends PaymentMethod {

  /**
   * @param {Card} card Card used as payment method.
   */
  constructor(card) {
    super(card.type, card.number);
  }
}

export default class BasePaymentProvider {

  /**
   * Make a payment.
   *
   * @param {string} paymentMethodType The list of payment method types (e.g. card) that this payment is allowed to use.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {number} amount Amount intended to be collected by this payment.
   * @param {string} description An arbitrary string attached to the object. Often useful for displaying to users.
   * @param {Object} [metadata] Set of key-value pairs that you can attach to an object.
   * @param {PaymentRecipient} [receipt] Payment receipt.
   *
   * @return {Promise<PaymentResult>}
   * @async
   */
  async makePayment(paymentMethodType, currency, amount, description, metadata = undefined, receipt = undefined) {
  }

  /**
   * Update a payment.
   *
   * @param {string} paymentNumber Number of a payment created.
   * @param {number} currency Three-letter ISO currency code, in lowercase.
   * @param {PaymentMethod} paymentMethod Payment method.
   *
   *
   * @return {Promise<PaymentResult>}
   * @async
   */
  async updatePayment(paymentNumber, currency, paymentMethod) {
  }
}
