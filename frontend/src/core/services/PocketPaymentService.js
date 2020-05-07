import PocketBaseService from "./PocketBaseService";
import axios from "axios";

class PocketPaymentService extends PocketBaseService {
  constructor() {
    super("api/payments");
  }

  /**
   * Get payment history.
   *
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
}

export default new PocketPaymentService();
