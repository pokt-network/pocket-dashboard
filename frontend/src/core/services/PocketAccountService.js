import PocketBaseService from "./PocketBaseService";
import axios from "axios";

export class PocketAccountService extends PocketBaseService {
  constructor() {
    super("api/accounts");
  }

  /**
   * Import an account into network.
   *
   * @param {string} accountPrivateKey Account private key.
   *
   * @returns {Promise<*>}
   */
  importAccount(accountPrivateKey) {
    const data = {
      accountPrivateKey,
    };

    return axios
      .post(this._getURL("import"), data)
      .then((response) => response.data)
      .catch((err) => err.response.data);
  }
}

export default new PocketAccountService();
