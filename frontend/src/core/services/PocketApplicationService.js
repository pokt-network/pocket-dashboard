import PocketBaseService from "./PocketBaseService";
import axios from "axios";
import SecureLS from "secure-ls";
import {Configurations} from "../../_configuration";

export class PocketApplicationService extends PocketBaseService {

  constructor() {
    super("api/applications");

    this.ls = new SecureLS(Configurations.secureLS);
  }

  static parseAAT(aat) {
    let aatParsed = {
      version: aat.version
    };

    delete aat.version;

    for (let [key, value] of Object.entries(aat)) {
      aatParsed[key] = `${value.slice(0, 15)}...`;
    }
    return JSON.stringify(aatParsed, null, 2);
  }

  /**
   * Remove app address data from local storage.
   */
  removeAppInfoFromCache() {
    this.ls.remove("app_address");
    this.ls.remove("app_private_key");
    this.ls.remove("app_chains");
  }

  /**
   * Get Address and chains for app creating/importing
   */
  getAppAInfo() {
    return {
      address: this.ls.get("app_address").data,
      privateKey: this.ls.get("app_private_key").data,
      chains: this.ls.get("app_chains").data,
    };
  }

  /**
   * Save application address and chains in local storage encrypted.
   *
   * @param {string} address Pocket application address
   * @param {string} privateKey Pocket application private key
   * @param {Array<string>} chains Pocket application chosen chains.
   */
  saveAppInfoInCache({address, privateKey, chains}) {
    if (address) {
      this.ls.set("app_address", {data: address});
    }
    if (privateKey) {
      this.ls.set("app_private_key", {data: privateKey});
    }
    if (chains) {
      this.ls.set("app_chains", {data: chains});
    }
  }

  /**
   * Get application.
   *
   * @param {string} applicationAddress Application address in hex.
   *
   * @returns {Promise|Promise<*>}
   */
  getApplication(applicationAddress) {
    return axios.get(this._getURL(`/${applicationAddress}`))
      .then(response => response.data);
  }

  /**
   * Get all available applications.
   *
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAllApplications(limit, offset = 0, status=undefined) {
    const params = {limit, offset, status};

    return axios.get(this._getURL(""), {params})
      .then(response => response.data);
  }

  /**
   * Get all available user applications.
   *
   * @param {string} user Email of user.
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAllUserApplications(user, limit, offset = 0, status=undefined) {
    // Axios options format to send both query parameters and body data
    return axios({
      method: "post",
      url: this._getURL("user"),
      data: {
        user
      },
      params: {
        limit,
        offset,
        status,
      }
    }).then(response => response.data);
  }

  /**
   * Get staked summary data.
   *
   * @return {Promise|Promise<*>}
   */
  getStakedApplicationSummary() {
    return axios.get(this._getURL("summary/staked"))
      .then(response => response.data);
  }


  /**
   * Create application.
   *
   * @param {string} name Name.
   * @param {string} owner Owner.
   * @param {string} url URL.
   * @param {string} contactEmail Contact email.
   * @param {string} [description] Description.
   * @param {string} [icon] Icon (string is in base64 format).
   * @param {string} [user] User email.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async createApplication(name, owner, url, contactEmail, description, icon, user) {
    const data = {name, owner, url, contactEmail, description, icon, user};

    return axios.post(this._getURL(""), data)
      .then(response => {
        if (response.status === 200) {
          return {
            success: true,
            data: response.data
          };
        }

        return {
          success: false
        };
      }).catch(err => {
        return {
          success: false,
          data: err
        };
      });
  }

  /**
   * Create free tier application.
   *
   * @param {string} applicationAccountAddress Application account address.
   * @param {string[]} networkChains Network chains to stake application.
   *
   * @returns {Promise|Promise<*>}
   */
  stakeFreeTierApplication(applicationAccountAddress, networkChains) {
    return axios.post(this._getURL("/freetier/stake"), {applicationAccountAddress, networkChains})
      .then(response => response.data);
  }

  /**
   * GET AAT from free.
   *
   * @param {string} applicationAccountAddress Application account address.
   *
   * @returns {Promise|Promise<*>}
   */
  getFreeTierAppAAT(applicationAccountAddress) {
    return axios
      .get(this._getURL(`/freetier/aat/${applicationAccountAddress}`))
      .then((response) => response.data);
  }

  /**
   * Delete an application from dashboard (but not from the network).
   *
   * @param {string} applicationAccountAddress Application account address.
   *
   * @returns {Promise|Promise<*>}
   */
  deleteAppFromDashboard(applicationAccountAddress) {
    return axios
      .delete(this._getURL(`/${applicationAccountAddress}`))
      .then((response) => response.data);
  }

  /**
   * Unstake a free tier application.
   *
   * @param {string} applicationAccountAddress Application account address.
   *
   * @returns {Promise|Promise<*>}
   */
  unstakeFreeTierApplication(applicationAccountAddress) {
    return axios
      .post(this._getURL("/freetier/unstake"), {applicationAccountAddress})
      .then((response) => response.data);
  }
}

export default new PocketApplicationService();
