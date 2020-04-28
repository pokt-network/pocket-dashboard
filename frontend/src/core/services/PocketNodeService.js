import PocketBaseService from "./PocketBaseService";
import axios from "axios";

class PocketNodeService extends PocketBaseService {
  constructor() {
    super("api/nodes");
  }

  /**
   * Create a new node application
   * @param {Object} nodeData Node information
   * @param {string} nodeData.name - Name.
   * @param {string} nodeData.owner Owner.
   * @param {string} nodeData.contactEmail Contact Email.
   * @param {string} nodeData.description Description.
   * @param {string} nodeData.icon Icon (string in base64 format).
   * @param {string} nodeData.user User Email.
   * @param {string} privateKey Private Key (if node is imported).
   */
  createNode(nodeData, privateKey = undefined) {
    const data = privateKey ? {nodeData, privateKey} : {nodeData};

    return axios
      .post(this._getURL(""), data)
      .then((response) => {
        if (response.status === 200) {
          return {success: true, data: response.data};
        }

        return {success: false};
      })
      .catch((err) => {
        return {success: false, data: err};
      });
  }

  /**
   * Get all available applications.
   *
   * @param {number} limit Limit of query.
   * @param {number} offset Offset of query.
   * @param {number} status Filter by status.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAllNodes(limit, offset = 0, status = undefined) {
    const params = {limit, offset, status};

    return axios
      .get(this._getURL(""), {params})
      .then((response) => response.data);
  }

  getAllUserNodes(user, limit, offset = 0, status = undefined) {
    // Axios options format to send both query parameters and body data
    return axios({
      method: "post",
      url: this._getURL("user"),
      data: {
        user,
      },
      params: {
        limit,
        offset,
        status,
      },
    }).then((response) => response.data);
  }
}

export default new PocketNodeService();
