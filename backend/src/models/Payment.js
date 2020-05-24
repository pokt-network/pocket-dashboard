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
   * @param {string} [paymentHistoryData.paymentMethodID] User.
   * @param {BillingDetails} [paymentHistoryData.billingDetails] Billing details.
   * @param {string} [paymentHistoryData.status] Status.
   *
   * @returns {PaymentHistory} A new Payment history.
   * @static
   */
  static createPaymentHistory(paymentHistoryData) {
    const {createdDate, paymentID, currency, amount, item, user, paymentMethodID, billingDetails, status} = paymentHistoryData;
    const paymentHistory = new PaymentHistory(createdDate, paymentID, currency, amount, item, user);

    paymentHistory.paymentMethodID = paymentMethodID;
    paymentHistory.billingDetails = billingDetails;
    paymentHistory.status = status ?? "pending";

    return paymentHistory;
  }

  /**
   * @returns {{account: string, name: string, type: string, validatorPower?: string, maxRelay?: string}} Payment item.
   */
  getItem() {
    return this.item;
  }

  /**
   * @param {boolean} throwError Throw an error if item is not a node.
   *
   * @returns {boolean} If payment item is a node or not.
   * @throws Error if throwError is true and payment item is not a node.
   */
  isNodePaymentItem(throwError = false) {
    /** @type {string} */
    const type = this.item.type;

    /** @type {string} */
    const validatorPower = this.item.validatorPower;

    const isNode = type.toLowerCase() === "node" && validatorPower !== undefined;

    if (throwError && !isNode) {
      throw Error("The payment item is not a node");
    }

    return isNode;
  }

  /**
   * @param {boolean} throwError Throw an error if item is not an application.
   *
   * @returns {boolean} If payment item is an application or not.
   * @throws Error if throwError is true and payment item is not application.
   */
  isApplicationPaymentItem(throwError = false) {
    /** @type {string} */
    const type = this.item.type;

    /** @type {string} */
    const maxRelay = this.item.maxRelay;

    const isApplication = type.toLowerCase() === "application" && maxRelay !== undefined;

    if (throwError && !isApplication) {
      throw Error("The payment item is not an application");
    }

    return isApplication;
  }

  /**
   * @param {boolean} throwError Throw an error if is not succeed.
   *
   * @returns {boolean} If payment was succeeded or not.
   * @throws Error if throwError is true and payment is not success.
   */
  isSuccessPayment(throwError = false) {
    const succeeded = this.status === "succeeded";

    if (throwError && !succeeded) {
      throw Error("The payment is not succeed");
    }

    return succeeded;
  }
}
