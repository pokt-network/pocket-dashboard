import PocketBaseService from "./PocketBaseService";
import axios from "axios";

export class PocketAccountService extends PocketBaseService {
  constructor() {
    super("api/accounts");
  }

  /**
   * Validate an account into the network.
   *
   * @param {string} accountPrivateKey Account private key.
   * @param {string} passphrase Account passphrase.
   *
   * @returns {Promise<*>}
   */
  importAccount(accountPrivateKey, passphrase) {
    const data = {
      accountPrivateKey,
      passphrase,
    };

    return axios
      .post(this._getURL("import"), data)
      .then((response) => {
        return {success: true, data: response.data};
      })
      .catch((err) => {
        return {success: false, data: err.response.data};
      });
  }
}

export default new PocketAccountService();
