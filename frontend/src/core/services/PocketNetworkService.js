import PocketBaseService from "./PocketBaseService";
import axiosInstance from "./_serviceHelper";
const axios = axiosInstance();

class PocketNetworkService extends PocketBaseService {
  constructor() {
    super("api/network");
  }

  static addIndex = (ch, idx) => {
    return {
      ...ch,
      index: idx + 1,
    };
  };

  /**
   * Get all available network chains.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAvailableNetworkChains(indexed = true) {
    return axios.get(this._getURL("chains")).then((response) => {
      if (indexed) {
        return response.data.map(PocketNetworkService.addIndex);
      }
      return response.data;
    });
  }

  /**
   * Get Network chains from hashes.
   *
   * @param {string[]} networkHashes Network hashes.
   * @param {boolean} indexed If insert an index to data.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getNetworkChains(networkHashes, indexed = true) {
    const data = { networkHashes };

    return axios.post(this._getURL("chains"), data).then((response) => {
      if (indexed) {
        return response.data.map(PocketNetworkService.addIndex);
      }
      return response.data;
    }).catch((err) => {
      return {
        error: true,
        name: err.response.data.name,
        message: err.response.data.message,
      };
    });
  }

  /**
   * Get network summary.
   *
   * @returns {Promise|Promise<Array.<*>>}
   */
  getNetworkSummaryData() {
    return axios
      .get(this._getURL("summary"))
      .then((response) => response.data)
      .catch((err) => {
        return {
          error: true,
          name: err.response.data.name,
          message: err.response.data.message,
        };
      });
  }
}

export default new PocketNetworkService();
