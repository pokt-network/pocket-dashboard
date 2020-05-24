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

  /**
   * Get account balance.
   *
   * @param {string} accountAddress Account address in hex to query.
   *
   * @returns {Promise<number|*>} The balance of account.
   */
  getBalance(accountAddress) {
    return axios
      .get(this._getURL(`balance/${accountAddress}`))
      .then((response) => response.data);
  }
}

export default new PocketAccountService();
