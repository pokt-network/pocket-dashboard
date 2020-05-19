import PocketBaseService from "./PocketBaseService";
import axios from "axios";

class PocketNetworkService extends PocketBaseService {
  constructor() {
    super("api/network");
  }

  static addIndex = (ch, idx) => {
    return {
      ...ch,
      index: idx,
    };
  };

  /**
   * Get all available network chains.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAvailableNetworkChains(indexed = true) {
    return axios.get(this._getURL("/chains")).then((response) => {
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
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getNetworkChains(networkHashes, indexed = true) {
    const data = {networkHashes};

    return axios.post(this._getURL("/chains"), data).then((response) => {
      if (indexed) {
        return response.data.map(PocketNetworkService.addIndex);
      }
      return response.data;
    });
  }
}

export default new PocketNetworkService();
