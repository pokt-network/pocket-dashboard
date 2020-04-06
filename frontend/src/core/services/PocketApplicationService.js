import PocketBaseService from "./PocketBaseService";
import axios from "axios";


class PocketApplicationService extends PocketBaseService {

  constructor() {
    super("api/applications");
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
  getAllApplications(limit, offset = 0) {
    const params = {limit, offset};

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
  getAllUserApplications(user, limit, offset = 0) {
    // Axios options format to send both query parameters and body data
    return axios({
      method: "post",
      url: this._getURL("user"),
      data: {
        user
      },
      params: {
        limit,
        offset
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
   * @param {string} privateApplicationKey Application private key.
   * @param {string[]} networkChains Network chains to stake application.
   *
   * @returns {Promise|Promise<*>}
   */
  createFreeTierApplication(privateApplicationKey, networkChains) {
    return axios.post(this._getURL("/freetier"), {privateApplicationKey, networkChains})
      .then(response => response.data);
  }

}

export default new PocketApplicationService();
