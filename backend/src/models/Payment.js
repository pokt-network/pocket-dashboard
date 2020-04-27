export class BillingAddress {

  /**
   * @param {string} line1 Line 1.
   * @param {string} postalCode Zip code.
   * @param {string} country Country.
   */
  constructor(line1, postalCode, country) {
    Object.assign(this, {line1, postal_code: postalCode, country});
  }

  /**
   * Validate address data.
   *
   * @param {object} addressData Address to validate.
   * @param {string} addressData.line1 Line 1.
   * @param {string} addressData.postal_code Zip code.
   * @param {string} addressData.country Country.
   *
   * @returns {boolean} If is validation success
   * @throws {Error} If validation fails
   * @static
   */
  static validate(addressData) {
    if (!addressData.line1) {
      throw Error("Line 1 is required");
    }

    if (!addressData.postal_code) {
      throw Error("Postal code is required");
    }

    if (!addressData.country) {
      throw Error("Country is required");
    }

    return true;
  }
}

export class BillingDetails {

  /**
   * @param {string} name Name.
   * @param {BillingAddress} address Address.
   */
  constructor(name, address) {
    Object.assign(this, {name, address});
  }

  /**
   * Validate billing details.
   *
   * @param {object} billingDetailData Billing details to validate.
   * @param {string} billingDetailData.name Name.
   * @param {BillingAddress} billingDetailData.address Billing address.
   *
   * @returns {boolean} If is validation success
   * @throws {Error} If validation fails
   * @static
   */
  static validate(billingDetailData) {
    if (!billingDetailData.name) {
      throw Error("Name is required");
    }

    if (!billingDetailData.address) {
      throw Error("Address is required");
    }

    // noinspection JSCheckFunctionSignatures
    BillingAddress.validate(billingDetailData.address);

    return true;
  }
}

export class PaymentMethod {

  /**
   * @param {string} id ID.
   * @param {string} user User.
   * @param {BillingDetails} billingDetails Billing details.
   */
  constructor(id, user, billingDetails) {
    Object.assign(this, {id, user, billingDetails});
  }

  /**
   * Validate billing details.
   *
   * @param {object} paymentMethodData Payment method data.
   * @param {string} paymentMethodData.id ID.
   * @param {string} paymentMethodData.user User.
   * @param {BillingDetails} paymentMethodData.billingDetails Billing details.
   *
   * @returns {boolean} If is validation success
   * @throws {Error} If validation fails
   * @static
   */
  static validate(paymentMethodData) {
    if (!paymentMethodData.id) {
      throw Error("ID is required");
    }

    if (!paymentMethodData.user) {
      throw Error("User is required");
    }

    if (!paymentMethodData.billingDetails) {
      throw Error("Billing details is required");
    }

    // noinspection JSCheckFunctionSignatures
    BillingDetails.validate(paymentMethodData.billingDetails);

    return true;
  }

  /**
   * Convenient Factory method to create a payment method.
   *
   * @param {object} paymentMethodData Payment method data.
   * @param {string} paymentMethodData.id ID.
   * @param {string} paymentMethodData.user User.
   * @param {BillingDetails} paymentMethodData.billingDetails Billing details.
   *
   * @returns {PaymentMethod} A new Payment method.
   * @static
   */
  static createPaymentMethod(paymentMethodData) {
    const {id, user, billingDetails} = paymentMethodData;

    return new PaymentMethod(id, user, billingDetails);
  }
}

export class PaymentHistory {

  /**
   * @param {string} createdDate Date created.
   * @param {string} paymentID payment ID.
   * @param {string} currency Currency.
   * @param {number} amount Amount.
   * @param {*} item Item
   * @param {string} user User.
   */
  constructor(createdDate, paymentID, currency, amount, item, user) {
    Object.assign(this, {createdDate, paymentID, currency, amount, item, user});

    /** @type {string} */
    this.paymentMethodID = "";

    /** @type {BillingDetails} */
    this.billingDetails = null;

    this.status = "pending";
  }

  /**
   * Convenient Factory method to create a payment history entry.
   *
   * @param {object} paymentHistoryData Payment method data.
   * @param {string} paymentHistoryData.createdDate Date created.
   * @param {string} paymentHistoryData.paymentID payment ID.
   * @param {string} paymentHistoryData.currency Currency.
   * @param {number} paymentHistoryData.amount Amount.
   * @param {*} paymentHistoryData.item Item
   * @param {string} paymentHistoryData.user User.
   *
   * @returns {PaymentHistory} A new Payment history.
   * @static
   */
  static createPaymentHistory(paymentHistoryData) {
    const {createdDate, paymentID, currency, amount, item, user} = paymentHistoryData;

    return new PaymentHistory(createdDate, paymentID, currency, amount, item, user);
  }
}
