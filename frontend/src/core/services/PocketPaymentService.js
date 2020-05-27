import PocketBaseService from "./PocketBaseService";
import axios from "axios";
import PocketUserService from "./PocketUserService";
import {ITEM_TYPES} from "../../_constants";
import SecureLS from "secure-ls";
import {Configurations} from "../../_configuration";

class PocketPaymentService extends PocketBaseService {
  constructor() {
    super("api/payments");

    this.ls = new SecureLS(Configurations.secureLS);
  }

  /**
   * Get default payment method.
   *
   * @returns {string}
   */
  getDefaultPaymentMethod() {
    return this.ls.get("default_payment_method").data;
  }

  /**
   * Save default payment method in localsotrage
   *
   * @param {string} paymentMethodId payment method id.
   */
  setDefaultPaymentMethod(paymentMethodId) {
    this.ls.set("default_payment_method", {data: paymentMethodId});
  }

  /* Remove default payment method*/
  removeDefaultPaymentMethod() {
    this.ls.remove("default_payment_method");
  }

  /**
   * Save custom tier application's relays per day in localstorage
   *
   * @param {object} data anonymous object.
   * @param {number} [data.relays] Relays per day.
   * @param {number} [data.costPerRelay] cost per relay.
   * @param {number} [data.validationPower] validation power.
   * @param {number} [data.validationPowerCost] cost of validation power.
   */
  savePurchaseInfoInCache({relays, costPerRelay, validationPower, validationPowerCost}) {
    /**
     * The reason this is made manually is as there are only a few fields
     * and want to let clear what items from localstorage are being used,
     * rather than automatically generate them from fields.
     */
    if (relays) {
      localStorage.setItem("app_relays", relays.toString());
    }
    if (costPerRelay) {
      localStorage.setItem("app_relay_cost", costPerRelay.toString());
    }
    if (validationPower) {
      localStorage.setItem("node_validation_power", validationPower.toString());
    }
    if (validationPowerCost) {
      localStorage.setItem("node_validation_power_cost", validationPowerCost.toString());
    }
  }

  /**
   * Get custom app relays per day.
   *
   * @return {{relays: number, costPerRelay: number, validationPower:number, validationPowerCost: number}}
   */
  getPurchaseInfo() {
    return {
      relays: parseInt(localStorage.getItem("app_relays")),
      costPerRelay: parseFloat(localStorage.getItem("app_relay_cost")),
      validationPower: parseInt(localStorage.getItem("node_validation_power")),
      validationPowerCost: parseFloat(localStorage.getItem("node_validation_power_cost")),
    };
  }

  /**
   * Remove application's relays per day from local storage.
   */
  removePurchaseInfoFromCache() {
    localStorage.removeItem("app_relays");
    localStorage.removeItem("app_relay_cost");
    localStorage.removeItem("node_validation_power");
    localStorage.removeItem("node_validation_power_cost");
  }

  /**
   * Get payment history.
   *
   * @param {string} user User.
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getPaymentHistory(user, limit, offset = 0) {
    return axios({
      method: "post",
      url: this._getURL("history"),
      data: {
        user,
      },
      params: {
        limit,
        offset,
      },
    }).then((response) => response.data);
  }

  /**
   * Get payment history.
   *
   * @param {number} paymentId Stripe payment ID.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getPaymentDetail(paymentId) {
    return axios
      .get(this._getURL(`history/${paymentId}`))
      .then((response) => response.data);
  }

  /**
   * Get user available payment methods.
   *
   * @param {string} user User email
   */
  getPaymentMethods(user) {
    return axios
      .post(this._getURL("payment_methods"), {user})
      .then((response) => response.data);
  }

  /**
   * Delete a payment method from dashboard.
   *
   * @param {string} paymentMethodID Payment method ID.
   */
  deletePaymentMethod(paymentMethodID) {
    return axios
      .delete(this._getURL(`payment_method/${paymentMethodID}`))
      .then((response) => response.data);
  }

  /**
   * Get available currencies.
   */
  getAvailableCurrencies() {
    return axios
      .get(this._getURL("currencies"))
      .then((response) => response.data);
  }

  /**
   * Create new payment intent for purchase.
   *
   * @param {string} type Type of item (e.x. application, node).
   * @param {object} item Item data to purchase.
   * @param {string} currency Currency.
   * @param {number} amount Amount to pay.
   *
   * @return {Promise<*>}
   * @async
   */
  async createNewPaymentIntent(type, item, currency, amount) {
    const user = PocketUserService.getUserInfo().email;
    const data = {type: "card", user, item, currency, amount};

    let path;

    switch (type) {
      case ITEM_TYPES.APPLICATION:
        path = "apps";
        break;
      case ITEM_TYPES.NODE:
        path = "nodes";
        break;
      default:
        throw new Error("Invalid item type");
    }

    return axios
      .post(this._getURL(`new_intent/${path}`), data)
      .then((response) => {
        return {success: true, data: response.data};
      })
      .catch((err) => {
        return {success: false, data: err.response};
      });
  }
}

export default new PocketPaymentService();
