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
      version: aat.version,
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
    this.ls.remove("app_ppk");
    this.ls.remove("app_passphrase");
    this.ls.remove("app_chains");
    this.ls.remove("app_data");
    this.ls.remove("app_imported");
  }

  /**
   * Get Address and chains for app creating/importing
   */
  getApplicationInfo() {
    return {
      id: this.ls.get("app_id").data,
      address: this.ls.get("app_address").data,
      ppk: this.ls.get("app_ppk").data,
      passphrase: this.ls.get("app_passphrase").data,
      chains: this.ls.get("app_chains").data,
      data: this.ls.get("app_data").data,
      imported: this.ls.get("app_imported").data,
    };
  }

  /**
   * Save application address and chains in local storage encrypted.
   *
   * @param {string} [applicationID] Pocket application ID.
   * @param {string} [address] Pocket application address.
   * @param {string} [privateKey] Pocket application private key.
   * @param {string} [passphrase] Pocket application private key.
   * @param {Array<string>} [chains] Pocket application chosen chains.
   * @param {object} [data] Pocket application dashboard data.
   * @param {boolean} [imported] If the application is imported.
   */
  saveAppInfoInCache({
    applicationID,
    address,
    ppk,
    passphrase,
    chains,
    data,
    imported
    }) {
    if (applicationID) {
      this.ls.set("app_id", {data: applicationID});
    }
    if (address) {
      this.ls.set("app_address", {data: address});
    }
    if (ppk) {
      this.ls.set("app_ppk", {data: ppk});
    }
    if (passphrase) {
      this.ls.set("app_passphrase", {data: passphrase});
    }
    if (chains) {
      this.ls.set("app_chains", {data: chains});
    }
    if (data) {
      this.ls.set("app_data", {data: data});
    }
    if (imported !== undefined) {
      this.ls.set("app_imported", {data: imported});
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
    return axios
      .get(this._getURL(`${applicationAddress}`))
      .then((response) => response.data)
      .catch((err) => {
        return {
          error: true,
          name: err.response.data.name,
          message: err.response.data.message,
        };
      });
  }

  /**
   * Get network application.
   *
   * @param {string} applicationAddress Application address in hex.
   *
   * @returns {Promise|Promise<*>}
   */
  getNetworkApplication(applicationAddress) {
    return axios
      .get(this._getURL(`network/${applicationAddress}`))
      .then((response) => response.data)
      .catch((err) => {
        return {
          error: true,
          name: err.response.data.name,
          message: err.response.data.message,
        };
      });
  }

  /**
   * Get all available applications.
   *
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAllApplications(limit, offset = 0) {
    const params = {limit, offset};

    return axios
      .get(this._getURL(""), {params})
      .then((response) => response.data)
      .catch((err) => {
        return {
          error: true,
          name: err.response.data.name,
          message: err.response.data.message,
        };
      });
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
  getAllUserApplications(user, limit, offset = 0) {
    // Axios options format to send both query parameters and body data
    return axios({
      method: "post",
      url: this._getURL("user/all"),
      data: {
        user,
      },
      params: {
        limit,
        offset,
      },
    })
      .then((response) => response.data)
      .catch((err) => {
        return {
          error: true,
          name: err.response.data.name,
          message: err.response.data.message,
        };
      });
  }

  /**
   * Get staked summary data.
   *
   * @return {Promise|Promise<*>}
   */
  getStakedApplicationSummary() {
    return axios
      .get(this._getURL("summary/staked"))
      .then((response) => response.data)
      .catch((err) => {
        return {
          error: true,
          name: err.response.data.name,
          message: err.response.data.message,
        };
      });
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

    return axios
      .post(this._getURL(""), data)
      .then((response) => {
        if (response.status === 200) {
          return {
            success: true,
            data: response.data,
          };
        }

        return {
          success: false,
        };
      })
      .catch((err) => {
        return {
          success: false,
          data: err.response.data.message,
        };
      });
  }

  /**
   * Create application account.
   *
   * @param {string} applicationID Application ID.
   * @param {{address: string, publicKey: string}} applicationData Application data.
   * @param {string} applicationBaseLink Application base link.
   * @param {object} ppkData? PPK data(is imported).
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async saveApplicationAccount(applicationID, applicationData, applicationBaseLink, ppkData = undefined) {
    let data = {applicationID, applicationData, applicationBaseLink};

    if (ppkData) {
      data["ppkData"] = ppkData;
    }

    return axios
      .post(this._getURL("account"), data)
      .then((response) => {
        if (response.status === 200) {
          return {
            success: true,
            data: response.data,
          };
        }

        return {
          success: false,
        };
      })
      .catch((err) => {
        return {
          success: false,
          data: err.response.data.message,
          name: err.response.data.name,
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

    return axios
      .put(this._getURL(`${applicationAccountAddress}`), data)
      .then((response) => {
        if (response.status === 200) {
          return {
            success: true,
            data: response.data,
          };
        }

        return {
          success: false,
        };
      })
      .catch((err) => {
        return {
          success: false,
          data: err.response.data.message,
        };
      });
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
      .then((response) => {
        return {success: true, data: response.data};
      })
      .catch((err) => {
        return {
          success: false,
          data: err.response.data.message,
        };
      });
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
   * Create free tier application.
   *
   * @param {object} appStakeTransaction Transaction.
   * @param {string} applicationLink Application link.
   *
   * @returns {Promise|Promise<*>}
   */
  stakeFreeTierApplication(appStakeTransaction, applicationLink) {
    return axios
      .post(this._getURL("freetier/stake"), {appStakeTransaction, applicationLink})
      .then((response) => {
        return {
          success: true,
          data: response.data,
        };
      })     
      .catch((err) => {
        return {
          success: false,
          data: err.response.data.message,
          name: err.response.data.name,
        };
      });;
  }

  /**
   * Unstake a free tier application.
   *
   * @param {object} appUnstakeTransaction Transaction hash.
   * @param {string} appUnstakeTransaction.address Sender address
   * @param {string} appUnstakeTransaction.raw_hex_bytes Raw transaction bytes
   * @param {string} applicationLink Link to detail for email.
   *
   * @returns {Promise|Promise<*>}
   */
  unstakeFreeTierApplication(appUnstakeTransaction, applicationLink) {
    const data = {appUnstakeTransaction, applicationLink};

    return axios
      .post(this._getURL("freetier/unstake"), data)
      .then((response) => {
        return {success: true, data: response.data};
      })
      .catch((err) => {
        return {success: false, data: err.response};
      });
  }

  /**
   * Stake a custom tier application.
   *
   * @param {object} appStakeTransaction Transaction.
   * @param {string} paymentId payment's stripe confirmation id.
   * @param {string} applicationLink Link to detail for email.
   *
   * @returns {Promise|Promise<*>}
   */
  stakeApplication(appStakeTransaction, paymentId, applicationLink) {
    const data = {
      appStakeTransaction,
      payment: {id: paymentId},
      applicationLink,
    };

    return axios
      .post(this._getURL("custom/stake"), data)
      .then((response) => {
        return {success: true, data: response.data};
      })
      .catch((err) => {
        return {success: false, error: err.response};
      });
  }

  /**
   * Unstake a custom tier application.
   *
   * @param {object} appUnstakeTransaction Transaction hash.
   * @param {string} appUnstakeTransaction.address Sender address
   * @param {string} appUnstakeTransaction.raw_hex_bytes Raw transaction bytes
   * @param {string} applicationLink Link to detail for email.
   *
   * @returns {Promise|Promise<*>}
   */
  unstakeApplication(appUnstakeTransaction, applicationLink) {
    const data = {appUnstakeTransaction, applicationLink};

    return axios
      .post(this._getURL("custom/unstake"), data)
      .then((response) => {
        return {success: true, data: response.data};
      })
      .catch((err) => {
        return {success: false, data: err.response};
      });
  }
}

export default new PocketApplicationService();
