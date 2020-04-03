import PocketBaseService from "./PocketBaseService";
import axios from "axios";


class PocketNetworkService extends PocketBaseService {

  constructor() {
    super("api/network");
  }

  /**
   * Get all available network chains.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAvailableNetworkChains() {
    return axios.get(this._getURL("/chains"))
      .then(response => response.data);
  }

  /**
   * Get Network chains from hashes.
   *
   * @param {string[]} networkHashes Network hashes.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getNetworkChains(networkHashes) {
    const data = {networkHashes};

    return axios.post(this._getURL("/chains"), data)
      .then(response => response.data);
  }
}

export default new PocketNetworkService();
