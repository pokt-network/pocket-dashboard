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
    this.ls.remove("app_id");
    this.ls.remove("app_address");
    this.ls.remove("app_private_key");
    this.ls.remove("app_chains");
    this.ls.remove("app_data");
  }

  /**
   * Get Address and chains for app creating/importing
   */
  getApplicationInfo() {
    return {
      id: this.ls.get("app_id").data,
      address: this.ls.get("app_address").data,
      privateKey: this.ls.get("app_private_key").data,
      chains: this.ls.get("app_chains").data,
      data: this.ls.get("app_data").data,
    };
  }

  /**
   * Save application address and chains in local storage encrypted.
   *
   * @param {string} [applicationID] Pocket application ID.
   * @param {string} [address] Pocket application address.
   * @param {string} [privateKey] Pocket application private key.
   * @param {Array<string>} [chains] Pocket application chosen chains.
   * @param {object} [data] Pocket application dashboard data.
   */
  saveAppInfoInCache({applicationID, address, privateKey, chains, data}) {
    if (applicationID) {
      this.ls.set("app_id", {data: applicationID});
    }
    if (address) {
      this.ls.set("app_address", {data: address});
    }
    if (privateKey) {
      this.ls.set("app_private_key", {data: privateKey});
    }
    if (chains) {
      this.ls.set("app_chains", {data: chains});
    }
    if (data) {
      this.ls.set("app_data", {data: data});
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
    return axios.get(this._getURL(`${applicationAddress}`))
      .then(response => response.data);
  }

  /**
   * Get all available applications.
   *
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   * @param {number} [status] Status of applications.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAllApplications(limit, offset = 0, status = undefined) {
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
   * @param {number} [status] Status of applications.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAllUserApplications(user, limit, offset = 0, status = undefined) {
    // Axios options format to send both query parameters and body data
    return axios({
      method: "post",
      url: this._getURL("user/all"),
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
   * @param {object} application Application data.
   * @param {string} application.name Name.
   * @param {string} application.owner Owner.
   * @param {string} application.url URL.
   * @param {string} application.contactEmail Contact email.
   * @param {string} application.user User email.
   * @param {string} application.description Description.
   * @param {string} application.icon Icon (string is in base64 format).
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async createApplication(application) {
    const data = {application};

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
          data: err.response.data.message,
        };
      });
  }

  /**
   * Create application account.
   *
   * @param {object} applicationID Application ID.
   * @param {string} passphrase Passphrase.
   * @param {string} applicationBaseLink Application base link.
   * @param {string} privateKey? Private Key(is imported).
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async createApplicationAccount(applicationID, passphrase, applicationBaseLink, privateKey = undefined) {
    let data = {applicationID, passphrase, applicationBaseLink};

    if (privateKey) {
      data["privateKey"] = privateKey;
    }

    return axios.post(this._getURL("account"), data)
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
          data: err.response.data.message,
        };
      });
  }

  /**
   * Edit application.
   *
   * @param {string} applicationAccountAddress Application address.
   * @param {Object} applicationData Application data.
   * @param {string} applicationData.name Name.
   * @param {string} applicationData.owner Owner.
   * @param {string} applicationData.url URL.
   * @param {string} applicationData.contactEmail Contact email.
   * @param {string} applicationData.description Description.
   * @param {string} applicationData.icon Icon (string is in base64 format).
   * @param {string} applicationData.user User email.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async editApplication(applicationAccountAddress, applicationData) {
    const data = {...applicationData};

    return axios.put(this._getURL(`${applicationAccountAddress}`), data)
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
          data: err.response.data.message,
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
    return axios.post(this._getURL("freetier/stake"), {applicationAccountAddress, networkChains})
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
      .get(this._getURL(`freetier/aat/${applicationAccountAddress}`))
      .then((response) => response.data);
  }

  /**
   * Delete an application from dashboard (but not from the network).
   *
   * @param {string} applicationAccountAddress Application account address.
   * @param {string} userEmail User email address.
   * @param {string} appsLink Applications links.
   *
   * @returns {Promise|Promise<*>}
   */
  deleteAppFromDashboard(applicationAccountAddress, userEmail, appsLink) {
    const data = {user: userEmail, appsLink};

    return axios
      .post(this._getURL(`${applicationAccountAddress}`), data)
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
      .post(this._getURL("freetier/unstake"), {applicationAccountAddress})
      .then((response) => response.data);
  }


  /**
   * Get application data from network
   *
   * @param {string} applicationAccountAddress Application account address.
   *
   * @returns {Promise|Promise<*>}
   */
  getNetworkAppInfo(applicationAccountAddress) {
    return axios
      .get(this._getURL(`import/${applicationAccountAddress}`))
      .then((response) => response.data);
  }
}

export default new PocketApplicationService();
