import PocketBaseService from "./PocketBaseService";
import axios from "axios";


class PocketApplicationService extends PocketBaseService {

  constructor() {
    super("api/applications");
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
    const params = {limit, offset};
    const data = {user};

    return axios.post(this._getURL("/user"), {data, params})
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
   * @param {string} [icon] Icon.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async createApplication(name, owner, url, contactEmail, description, icon) {
    const data = {name, owner, url, contactEmail, description, icon};

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

}

export default new PocketApplicationService();
