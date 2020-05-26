import PocketBaseService from "./PocketBaseService";
import axios from "axios";
import SecureLS from "secure-ls";
import {Configurations} from "../../_configuration";

class PocketNodeService extends PocketBaseService {
  constructor() {
    super("api/nodes");
    this.ls = new SecureLS(Configurations.secureLS);
  }

  /**
   * Remove node data from local storage.
   */
  removeNodeInfoFromCache() {
    this.ls.remove("node_address");
    this.ls.remove("node_private_key");
    this.ls.remove("node_passphrase");
    this.ls.remove("node_id");
    this.ls.remove("node_chains");
    this.ls.remove("node_data");
  }

  /**
   * Get node information from localstorage
   */
  getNodeInfo() {
    return {
      id: this.ls.get("node_id").data,
      address: this.ls.get("node_address").data,
      privateKey: this.ls.get("node_private_key").data,
      passphrase: this.ls.get("node_passphrase").data,
      chains: this.ls.get("node_chains").data,
      data: this.ls.get("node_data").data,
    };
  }

  /**
   * Save node data in local storage encrypted.
   *
   * @param {string} [nodeID] Pocket node DB ID.
   * @param {string} address Pocket node address
   * @param {string} privateKey Pocket node private key
   * @param {string} [passphrase] Pocket node private key.
   * @param {object} [data] Pocket node dashboard data.
   * @param {Array<string>} chains Pocket node chosen chains.
   */
  saveNodeInfoInCache({nodeID, address, privateKey, passphrase, data, chains}) {
    if (address) {
      this.ls.set("node_address", {data: address});
    }
    if (privateKey) {
      this.ls.set("node_private_key", {data: privateKey});
    }
    if (chains) {
      this.ls.set("node_chains", {data: chains});
    }
    if (nodeID) {
      this.ls.set("node_id", {data: nodeID});
    }
    if (passphrase) {
      this.ls.set("node_passphrase", {data: passphrase});
    }
    if (data) {
      this.ls.set("node_data", {data: data});
    }
  }

  /**
   * Create a new node
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
    const data = privateKey ? {node: nodeData, privateKey} : {node: nodeData};

    return axios
      .post(this._getURL(""), data)
      .then((response) => {
        if (response.status === 200) {
          return {success: true, data: response.data};
        }

        return {success: false};
      })
      .catch((err) => {
        return {success: false, data: err.response.data};
      });
  }

  /**
   * Edit node
   * @param {string} nodeAccountAddress Node address.
   * @param {Object} nodeData Node information
   * @param {string} nodeData.name - Name.
   * @param {string} nodeData.operator Operator.
   * @param {string} nodeData.contactEmail Contact Email.
   * @param {string} nodeData.description Description.
   * @param {string} nodeData.icon Icon (string in base64 format).
   * @param {string} nodeData.user User Email.
   * @param {string} privateKey Private Key (if node is imported).
   */
  editNode(nodeAccountAddress, nodeData) {
    const data = {...nodeData};

    return axios
      .put(this._getURL(`/${nodeAccountAddress}`), data)
      .then((response) => {
        if (response.status === 200) {
          return {success: true, data: response.data};
        }

        return {success: false};
      })
      .catch((err) => {
        return {success: false, data: err.response.data};
      });
  }

  /**
   * Get node.
   *
   * @param {string} nodeAddress Node address in hex.
   *
   * @returns {Promise|Promise<*>}
   */
  getNode(nodeAddress) {
    return axios
      .get(this._getURL(`${nodeAddress}`))
      .then((response) => response.data);
  }

  /**
   * Get all available nodes.
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
      url: this._getURL("user/all"),
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

  /**
   * Delete a node from dashboard (but not from the network).
   *
   * @param {string} nodeAccountAddress Node account address.
   *
   * @returns {Promise|Promise<*>}
   */
  deleteNodeFromDashboard(nodeAccountAddress, user, nodesLink) {
    const data = {user, nodesLink};

    return axios
      .post(this._getURL(`/${nodeAccountAddress}`), data)
      .then((response) => response.data);
  }

  /**
   * Unstake a node.
   *
   * @param {string} nodeAccountAddress Node account address.
   *
   * @returns {Promise|Promise<*>}
   */
  unstakeNode(privateKey, passPhrase, accountAddress, nodeLink) {
    const data = {node: {privateKey, passPhrase, accountAddress}, nodeLink};

    return axios
      .post(this._getURL("/unstake"), data)
      .then((response) => response.data)
      .catch((err) => err.response);
  }

  /**
   * Unjail a jailed node
   *
   * @param {string} nodeAccountAddress Node account address.
   *
   * @returns {Promise|Promise<*>}
   */
  unjailNode(nodeAccountAddress) {
    const data = {nodeAccountAddress};

    return axios
      .post(this._getURL("/unjail"), data)
      .then((response) => response.data);
  }
}

export default new PocketNodeService();
