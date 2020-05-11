import BaseService from "./BaseService";
import {get_default_payment_provider} from "../providers/payment/Index";
import {CardPaymentMethod, Payment, PaymentCurrencies, PaymentResult} from "../providers/payment/BasePaymentProvider";
import {BillingDetails, PaymentHistory, PaymentMethod} from "../models/Payment";

const PAYMENT_METHOD_COLLECTION_NAME = "PaymentMethods";
const PAYMENT_HISTORY_COLLECTION_NAME = "PaymentHistory";

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
   * @param {*} item Item to pay.
   * @param {number} amount Amount intended to be collected by this payment.
   * @param {string} to For what is the payment (Apps or Node).
   *
   * @returns {Promise<PaymentResult>} A payment result of intent.
   * @private
   * @async
   */
  async __createPocketPaymentIntent(type, currency, item, amount, to) {
    const description = `Acquiring POKT for ${to}`;

    return this._paymentProvider.createPaymentIntent(type, currency, item, amount, description);
  }

  /**
   * Create an payment intent for item.
   *
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {*} item Item to pay.
   * @param {number} amount Amount intended to be collected by this payment.
   * @param {string} itemType Item type for payment.
   *
   * @returns {Promise<PaymentResult | boolean>} A payment result of intent.
   * @throws Error if validation fails.
   * @async
   */
  async __createPocketPaymentForItem(type, currency, item, amount, itemType) {
    if (!Payment.validate({type, currency, item, amount})) {
      return false;
    }

    const paymentItem = {
      ...item,
      type: itemType
    };

    return this.__createPocketPaymentIntent(type, currency, paymentItem, amount, itemType);
  }

  /**
   * Get available currencies.
   *
   * @returns {string[]} List of currencies.
   */
  getAvailableCurrencies() {
    return Object.values(PaymentCurrencies);
  }

  /**
   * Check if payment method exists on DB.
   *
   * @param {PaymentMethod} paymentMethod Payment method to check if exists.
   *
   * @returns {Promise<boolean>} If payment method exists or not.
   * @async
   */
  async paymentMethodExists(paymentMethod) {
    const filter = {id: paymentMethod.id, user: paymentMethod.user};
    const dbPaymentMethod = await this.persistenceService.getEntityByFilter(PAYMENT_METHOD_COLLECTION_NAME, filter);

    return dbPaymentMethod !== undefined;
  }

  /**
   * Check if payment history exists on DB.
   *
   * @param {PaymentHistory} paymentHistory Payment history to check if exists.
   *
   * @returns {Promise<boolean>} If payment history exists or not.
   * @async
   */
  async paymentHistoryExists(paymentHistory) {
    const filter = {paymentID: paymentHistory.paymentID, user: paymentHistory.user};
    const dbPaymentHistory = await this.persistenceService.getEntityByFilter(PAYMENT_HISTORY_COLLECTION_NAME, filter);

    return dbPaymentHistory !== undefined;
  }

  /**
   * Save a payment method to DB.
   *
   * @param {object} paymentMethodData Payment method data.
   * @param {string} paymentMethodData.id ID.
   * @param {string} paymentMethodData.user User.
   * @param {BillingDetails} paymentMethodData.billingDetails Billing details.
   *
   * @returns {Promise<boolean>} If was saved or not.
   * @throws {Error} If validation fails or already exists.
   * @async
   */
  async savePaymentMethod(paymentMethodData) {
    if (!PaymentMethod.validate(paymentMethodData)) {
      return false;
    }

    const paymentMethod = PaymentMethod.createPaymentMethod(paymentMethodData);

    if (await this.paymentMethodExists(paymentMethod)) {
      throw new Error("Payment method already exists");
    }

    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.saveEntity(PAYMENT_METHOD_COLLECTION_NAME, paymentMethod);

    return result.result.ok === 1;
  }

  /**
   * Create an payment intent for application.
   *
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {*} item Item to pay.
   * @param {number} amount Amount intended to be collected by this payment.
   *
   * @returns {Promise<PaymentResult | boolean>} A payment result of intent.
   * @throws Error if validation fails.
   * @async
   */
  async createPocketPaymentIntentForApps(type, currency, item, amount) {
    return this.__createPocketPaymentForItem(type, currency, item, amount, "Application");
  }

  /**
   * Create an payment intent for node.
   *
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {*} item Item to pay.
   * @param {number} amount Amount intended to be collected by this payment.
   *
   * @returns {Promise<PaymentResult | boolean>} A payment result of intent.
   * @throws Error if validation fails.
   * @async
   */
  async createPocketPaymentIntentForNodes(type, currency, item, amount) {
    return this.__createPocketPaymentForItem(type, currency, item, amount, "Node");
  }

  /**
   * Get payment history.
   *
   * @param {string} user User that belongs payments.
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @returns {Promise<PaymentHistory[]>} List of Payment history.
   */
  async getPaymentHistory(user, limit, offset = 0) {
    const filter = {user};

    return (await this.persistenceService.getEntities(PAYMENT_HISTORY_COLLECTION_NAME, filter, limit, offset))
      .map(PaymentHistory.createPaymentHistory);
  }

  /**
   * Save payment on history.
   *
   * @param {string} createdDate Date created.
   * @param {string} paymentID Payment ID.
   * @param {string} currency Currency.
   * @param {number} amount Amount.
   * @param {*} item Item bought.
   * @param {string} user User that belongs the payment.
   *
   * @returns {Promise<boolean>} If payment was saved or not.
   * @async
   */
  async savePaymentHistory(createdDate, paymentID, currency, amount, item, user) {

    const paymentHistory = PaymentHistory.createPaymentHistory({createdDate, paymentID, currency, amount, item, user});

    if (await this.paymentHistoryExists(paymentHistory)) {
      throw new Error("Payment history entry already exists");
    }

    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.saveEntity(PAYMENT_HISTORY_COLLECTION_NAME, paymentHistory);

    return result.result.ok === 1;
  }


  /**
   * Mark payment as success on history.
   *
   * @param {object} paymentHistoryData Payment history data.
   * @param {string} paymentHistoryData.user User that belongs the payment.
   * @param {string} paymentHistoryData.paymentID Payment ID.
   * @param {string} paymentHistoryData.paymentMethodID Payment method ID.
   * @param {BillingDetails} paymentHistoryData.billingDetails Billing details.
   *
   * @returns {Promise<boolean>} If payment was marked or not.
   * @async
   */
  async markPaymentAsSuccess(paymentHistoryData) {
    const filter = {paymentID: paymentHistoryData.paymentID, user: paymentHistoryData.user};

    const paymentHistoryDB = await this.persistenceService.getEntityByFilter(PAYMENT_HISTORY_COLLECTION_NAME, filter);

    if (!paymentHistoryDB) {
      return false;
    }

    paymentHistoryDB.paymentMethodID = paymentHistoryData.paymentMethodID;
    paymentHistoryDB.billingDetails = paymentHistoryData.billingDetails;
    paymentHistoryDB.status = "succeeded";

    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.updateEntity(PAYMENT_HISTORY_COLLECTION_NAME, filter, paymentHistoryDB);

    return result.result.ok === 1;
  }

  /**
   * Get user payment methods.
   *
   * @param {string} user User email.
   *
   * @returns {Promise<[]|CardPaymentMethod[]>} Payment methods.
   */
  async getUserPaymentMethods(user) {
    const dbPaymentMethods = await this.persistenceService.getEntities(PAYMENT_METHOD_COLLECTION_NAME, {user});

    if (dbPaymentMethods) {
      const paymentMethodIds = dbPaymentMethods.map(_ => _.id);
      const paymentMethods = await this._paymentProvider.retrieveCardPaymentMethods(paymentMethodIds);

      return Promise.all(paymentMethods);
    }

    return [];
  }

  /**
   * Get Payment data from history.
   *
   * @param {string} paymentID Payment ID.
   *
   * @returns {Promise<PaymentHistory>} Payment data of the payment id.
   * @async
   */
  async getPaymentFromHistory(paymentID) {
    const filter = {paymentID};
    const dbPaymentHistory = await this.persistenceService.getEntityByFilter(PAYMENT_HISTORY_COLLECTION_NAME, filter);

    if (dbPaymentHistory) {
      return PaymentHistory.createPaymentHistory(dbPaymentHistory);
    }

    return null;
  }
}
