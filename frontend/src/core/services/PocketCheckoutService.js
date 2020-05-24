import PocketBaseService from "./PocketBaseService";
import axios from "axios";

export class PocketCheckoutService extends PocketBaseService {
  constructor() {
    super("api/checkout");
  }

  /**
   * Get relays per day data.
   *
   * @returns {Promise<object|*>} Relays per day data.
   */
  getRelaysPerDay() {
    return axios
      .get(this._getURL("relays-per-day"))
      .then((response) => response.data);
  }

  /**
   * Get money to spent.
   *
   * @param {number} relaysPerDay Relays per day.
   *
   * @returns {Promise<number|*>} Cost to spent.
   */
  getMoneyToSpent(relaysPerDay) {
    return axios
      .get(this._getURL(`cost?rpd=${relaysPerDay}`))
      .then((response) => response.data);
  }
}

export default new PocketCheckoutService();
