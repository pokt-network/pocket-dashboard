import BaseService from "./BaseService";
import {
  get_default_payment_provider,
  getTokenPaymentProvider,
  providerType,
} from "../providers/payment/Index";
import {
  CardPaymentMethod,
  Payment,
  PaymentCurrencies,
  PaymentResult,
} from "../providers/payment/BasePaymentProvider";
import {
  BillingDetails,
  PaymentHistory,
  PaymentMethod,
} from "../models/Payment";
import UserService from "./UserService";
import { Configurations } from "../_configuration";
import { DashboardError, DashboardValidationError } from "../models/Exceptions";

const PAYMENT_METHOD_COLLECTION_NAME = "PaymentMethods";
const PAYMENT_HISTORY_COLLECTION_NAME = "PaymentHistory";

export default class PaymentService extends BaseService {
  constructor() {
    super();

    this.userService = new UserService();
  }

  /**
   * Create an payment intent using the payment provider.
   *
   * @param {string} userCustomerID User customer ID.
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {*} item Item to pay.
   * @param {number} amount Amount intended to be collected by this payment.
   * @param {string} to For what is the payment (Apps or Node).
   * @param {number} tokens Tokens used for this payment.
   *
   * @returns {Promise<PaymentResult>} A payment result of intent.
   * @private
   * @async
   */
  async __createPocketPaymentIntent(
    userCustomerID,
    type,
    currency,
    item,
    amount,
    to,
    tokens
  ) {
    const description = `Acquiring ${
      to.toLowerCase() === "application"
        ? "Max Relays Per Day"
        : "Validator Power"
    } for ${to}`;

    if (amount === 0) {
      return this.__getPaymentProvider(providerType.token).createPaymentIntent(
        userCustomerID,
        type,
        currency,
        item,
        amount,
        description,
        tokens
      );
    } else {
      return this.__getPaymentProvider(providerType.stripe).createPaymentIntent(
        userCustomerID,
        type,
        currency,
        item,
        amount,
        description,
        tokens
      );
    }
  }

  __getPaymentProvider(type) {
    if (type === providerType.token) {
      return getTokenPaymentProvider();
    } else {
      return get_default_payment_provider();
    }
  }

  /**
   * Create an payment intent for item.
   *
   * @param {string} userEmail User of payment intent.
   * @param {string} type Type of payment.
   * @param {string} currency Three-letter ISO currency code, in lowercase.
   * @param {*} item Item to pay.
   * @param {number} amount Amount intended to be collected by this payment.
   * @param {string} itemType Item type for payment.
   * @param {number} tokens Tokens used for this payment.
   *
   * @returns {Promise<PaymentResult | boolean>} A payment result of intent.
   * @throws {DashboardValidationError} if validation fails.
   * @async
   */
  async __createPocketPaymentForItem(
    userEmail,
    type,
    currency,
    item,
    amount,
    itemType,
    tokens
  ) {
    if (!Payment.validate({ type, currency, item, amount })) {
      return false;
    }

    const provType = amount === 0 ? providerType.token : providerType.stripe;

    // Getting user customer from user, a customer is required by stripe.
    let userCustomerID = await this.userService.getUserCustomerID(userEmail);

    if (!userCustomerID) {
      const userCustomer = await this.__getPaymentProvider(
        provType
      ).createCustomer(userEmail);

      userCustomerID = userCustomer.id;
      await this.userService.saveCustomerID(userEmail, userCustomerID);
    }

    const amountFixed = Math.round(amount.toFixed(2) * 100);
    const paymentItem = {
      ...item,
      type: itemType,
    };

    return this.__createPocketPaymentIntent(
      userCustomerID,
      type,
      currency,
      paymentItem,
      amountFixed,
      itemType,
      tokens
    );
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
   * @param {PaymentMethod} paymentMethodData Payment method to check if exists.
   *
   * @returns {Promise<boolean>} If payment method exists or not.
   * @async
   */
  async paymentMethodExists(paymentMethodData) {
    const filter = {
      "paymentMethod.card.brand": paymentMethodData.paymentMethod.card.brand,
      "paymentMethod.card.country":
        paymentMethodData.paymentMethod.card.country,
      "paymentMethod.card.lastDigits":
        paymentMethodData.paymentMethod.card.lastDigits,
      "paymentMethod.card.expirationMonth":
        paymentMethodData.paymentMethod.card.expirationMonth,
      "paymentMethod.card.expirationYear":
        paymentMethodData.paymentMethod.card.expirationYear,
      user: paymentMethodData.user,
    };

    const dbPaymentMethod = await this.persistenceService.getEntityByFilter(
      PAYMENT_METHOD_COLLECTION_NAME,
      filter
    );

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
    const filter = {
      paymentID: paymentHistory.paymentID,
      user: paymentHistory.user,
    };
    const dbPaymentHistory = await this.persistenceService.getEntityByFilter(
      PAYMENT_HISTORY_COLLECTION_NAME,
      filter
    );

    return dbPaymentHistory !== undefined;
  }

  /**
   * Save a payment method to DB.
   *
   * @param {object} paymentMethodData Payment method data.
   * @param {string} paymentMethodData.user User.
   * @param {{id: string, card:*}} paymentMethodData.paymentMethod Card data.
   * @param {BillingDetails} paymentMethodData.billingDetails Billing details.
   *
   * @returns {Promise<boolean>} If was saved or not.
   * @throws {DashboardValidationError | DashboardError} If validation fails or already exists.
   * @async
   */
  async savePaymentMethod(paymentMethodData) {
    if (!PaymentMethod.validate(paymentMethodData)) {
      return false;
    }

    const paymentMethod = PaymentMethod.createPaymentMethod(paymentMethodData);

    if (await this.paymentMethodExists(paymentMethod)) {
      throw new DashboardError("Payment method already exists");
    }

    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.saveEntity(
      PAYMENT_METHOD_COLLECTION_NAME,
      paymentMethod
    );

    return result.result.ok === 1;
  }

  /**
   * Delete a payment method from DB.
   *
   * @param {string} paymentMethodID Payment method ID.
   * @param {string} authHeader Authorization header.
   *
   * @returns {Promise<boolean>} If was deleted or not.
   * @async
   */
  async deletePaymentMethod(paymentMethodID, authHeader) {
    const filter = { "paymentMethod.id": paymentMethodID };
    const userEmail = authHeader.split(", ")[2].split(" ")[1];
    let belongsToClient = false;

    if (userEmail) {
      const paymentMethods = await this.getUserPaymentMethods(userEmail);

      paymentMethods.forEach(method => {
        if (method.id.toString() === paymentMethodID.toString()) {
          belongsToClient = true;
        }
      });

      if (belongsToClient) {
        /** @type {{result: {n:number, ok: number}}} */
        const result = await this.persistenceService.deleteEntities(
          PAYMENT_METHOD_COLLECTION_NAME,
          filter
        );

        return result.result.ok === 1;
      }
    }
    return belongsToClient;
  }

  /**
   * Create a payment intent for application.
   *
   * @param {*} paymentIntentData Payment intent data.
   * @param {string} paymentIntentData.type Type of payment.
   * @param {string} paymentIntentData.currency Three-letter ISO currency code, in lowercase.
   * @param {*} paymentIntentData.item Item to pay.
   * @param {number} paymentIntentData.amount Amount intended to be collected by this payment.
   *
   * @returns {Promise<PaymentResult | boolean>} A payment result of intent.
   * @throws {DashboardValidationError} if validation fails.
   * @async
   */
  async createPocketPaymentIntentForApps(paymentIntentData) {
    const { user, type, currency, item, amount, tokens } = paymentIntentData;

    return this.__createPocketPaymentForItem(
      user,
      type,
      currency,
      item,
      amount,
      "Application",
      tokens
    );
  }

  /**
   * Create an payment intent for node.
   *
   * @param {*} paymentIntentData Payment intent data.
   * @param {string} paymentIntentData.type Type of payment.
   * @param {string} paymentIntentData.currency Three-letter ISO currency code, in lowercase.
   * @param {*} paymentIntentData.item Item to pay.
   * @param {number} paymentIntentData.amount Amount intended to be collected by this payment.
   *
   * @returns {Promise<PaymentResult | boolean>} A payment result of intent.
   * @throws {DashboardValidationError} if validation fails.
   * @async
   */
  async createPocketPaymentIntentForNodes(paymentIntentData) {
    const { user, type, currency, item, amount, tokens } = paymentIntentData;

    return this.__createPocketPaymentForItem(
      user,
      type,
      currency,
      item,
      amount,
      "Node",
      tokens
    );
  }

  /**
   * Get payment history.
   *
   * @param {string} user User that belongs payments.
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   * @param {string} [fromDate] From created date.
   * @param {string} [toDate] To created date.
   * @param {string} [paymentID] Payment ID.
   *
   * @returns {Promise<PaymentHistory[]>} List of Payment history.
   */
  async getPaymentHistory(
    user,
    limit,
    offset = 0,
    fromDate = "",
    toDate = "",
    paymentID = ""
  ) {
    let filter = { user };
    let dateFilter = {};

    if (fromDate) {
      dateFilter["$gte"] = new Date(Date.parse(fromDate));
    }

    if (toDate) {
      dateFilter["$lte"] = new Date(Date.parse(toDate));
    }

    if (fromDate || toDate) {
      filter["createdDate"] = dateFilter;
    }

    if (paymentID) {
      filter["paymentID"] = paymentID;
    }

    return (
      await this.persistenceService.getEntities(
        PAYMENT_HISTORY_COLLECTION_NAME,
        filter,
        limit,
        offset
      )
    ).map(PaymentHistory.createPaymentHistory);
  }

  /**
   * Verify if the payment belongs to the client's account using an payment id
   *
   * @param {string} paymentId Application Identifier.
   * @param {string} authHeader Authorization header.
   *
   * @returns {Promise<boolean>} True if the payment belongs to the client account or false otherwise.
   * @async
   */
  async verifyPaymentBelongsToClient(paymentId, authHeader) {
    // Retrieve the session tokens from the auth headers
    const accessToken = authHeader.split(", ")[0].split(" ")[1];
    const userEmail = authHeader.split(", ")[2].split(" ")[1];

    if (accessToken && userEmail) {
      const payload = await this.userService.decodeToken(accessToken, true);

      if (payload instanceof DashboardValidationError) {
        throw payload;
      }
      // Use token email to retrieve a list of the payments
      const paymentHistory = await this.getPaymentFromHistory(paymentId);

      if (
        paymentHistory.user.toString() === userEmail.toString() &&
        userEmail.toString() === payload.email.toString()
      ) {
        return true;
      }
    }

    return false;
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
   * @param {number} tokens Tokens used for this payment.
   *
   * @returns {Promise<boolean>} If payment was saved or not.
   * @async
   */
  async savePaymentHistory(
    createdDate,
    paymentID,
    currency,
    amount,
    item,
    user,
    tokens
  ) {
    const { pokt_market_price: poktPrice } = Configurations.pocket_network;
    const token = tokens === undefined ? 0 : tokens;

    const paymentHistory = PaymentHistory.createPaymentHistory({
      createdDate,
      paymentID,
      currency,
      amount,
      item,
      user,
      poktPrice,
      tokens: token,
    });

    if (await this.paymentHistoryExists(paymentHistory)) {
      throw new Error("Payment history entry already exists");
    }

    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.saveEntity(
      PAYMENT_HISTORY_COLLECTION_NAME,
      paymentHistory
    );

    return result.result.ok === 1;
  }

  /**
   * Update payment history record with the printable data object.
   *
   * @param {string} paymentId Payment Identifier.
   * @param {string} userEmail User email.
   * @param {object} printableData Payment invoice printable data.
   *
   * @returns {Promise<boolean>} If payment was marked or not.
   * @async
   */
  async updatePaymentWithPrintableData(paymentId, userEmail, printableData) {
    const filter = { paymentID: paymentId, user: userEmail };

    const paymentHistoryDB = await this.persistenceService.getEntityByFilter(
      PAYMENT_HISTORY_COLLECTION_NAME,
      filter
    );

    if (!paymentHistoryDB) {
      return false;
    }

    paymentHistoryDB.printableData = printableData;

    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.updateEntity(
      PAYMENT_HISTORY_COLLECTION_NAME,
      filter,
      paymentHistoryDB
    );

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
    const filter = {
      paymentID: paymentHistoryData.paymentID,
      user: paymentHistoryData.user,
    };

    const paymentHistoryDB = await this.persistenceService.getEntityByFilter(
      PAYMENT_HISTORY_COLLECTION_NAME,
      filter
    );

    if (!paymentHistoryDB) {
      return false;
    }

    paymentHistoryDB.paymentMethodID = paymentHistoryData.paymentMethodID;
    paymentHistoryDB.billingDetails = paymentHistoryData.billingDetails;
    paymentHistoryDB.status = "succeeded";

    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.updateEntity(
      PAYMENT_HISTORY_COLLECTION_NAME,
      filter,
      paymentHistoryDB
    );

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
    const dbPaymentMethods = await this.persistenceService.getEntities(
      PAYMENT_METHOD_COLLECTION_NAME,
      { user }
    );

    if (dbPaymentMethods) {
      const paymentMethodIds = dbPaymentMethods.map(_ => _.paymentMethod.id);
      const paymentMethods = await this.__getPaymentProvider(
        providerType.stripe
      ).retrieveCardPaymentMethods(paymentMethodIds);

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
    const filter = { paymentID };
    const dbPaymentHistory = await this.persistenceService.getEntityByFilter(
      PAYMENT_HISTORY_COLLECTION_NAME,
      filter
    );

    if (dbPaymentHistory) {
      const paymentHistory = PaymentHistory.createPaymentHistory(
        dbPaymentHistory
      );

      if (paymentHistory) {
        return paymentHistory;
      }
    }

    return null;
  }
}
