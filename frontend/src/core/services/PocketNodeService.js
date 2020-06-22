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
    this.ls.remove("node_id");
    this.ls.remove("node_address");
    this.ls.remove("node_ppk");
    this.ls.remove("node_passphrase");
    this.ls.remove("node_chains");
    this.ls.remove("node_data");
    this.ls.remove("node_imported");
  }

  /**
   * Get node information from local storage
   */
  getNodeInfo() {
    return {
      id: this.ls.get("node_id").data,
      address: this.ls.get("node_address").data,
      ppk: this.ls.get("node_ppk").data,
      passphrase: this.ls.get("node_passphrase").data,
      chains: this.ls.get("node_chains").data,
      data: this.ls.get("node_data").data,
      imported: this.ls.get("node_imported").data,
      serviceURL: this.ls.get("node_service_url").data,
    };
  }

  /**
   * Save node data in local storage encrypted.
   *
   * @param {string} [nodeID] Pocket application ID.
   * @param {string} [address] Pocket node address.
   * @param {string} [privateKey] Pocket node private key.
   * @param {string} [passphrase] Pocket node private key.
   * @param {Array<string>} [chains] Pocket node chosen chains.
   * @param {object} [data] Pocket node dashboard data.
   * @param {boolean} [imported] If the node is imported.
   * @param {string} [serviceURL] The service URL.
   */
  saveNodeInfoInCache({
      nodeID,
      address,
      ppk,
      passphrase,
      chains,
      data,
      imported,
      serviceURL,
    }) {
    if (nodeID) {
      this.ls.set("node_id", {data: nodeID});
    }
    if (address) {
      this.ls.set("node_address", {data: address});
    }
    if (ppk) {
      this.ls.set("node_ppk", {data: ppk});
    }
    if (passphrase) {
      this.ls.set("node_passphrase", {data: passphrase});
    }
    if (chains) {
      this.ls.set("node_chains", {data: chains});
    }
    if (data) {
      this.ls.set("node_data", {data: data});
    }
    if (serviceURL) {
      this.ls.set("node_service_url", {data: serviceURL});
    }
    if (imported !== undefined) {
      this.ls.set("node_imported", {data: imported});
    }
  }

  /**
   * Create a new node
   *
   * @param {Object} node Node information.
   * @param {string} node.name Name.
   * @param {string} node.operator Operator.
   * @param {string} node.contactEmail Contact Email.
   * @param {string} node.description Description.
   * @param {string} node.icon Icon (string in base64 format).
   * @param {string} node.user User Email.
   */
  createNode(node) {
    const data = {node};

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
   * Create node account.
   *
   * @param {string} nodeID Node ID.
   * @param {{address: string, publicKey: string}} nodeData Application data.
   * @param {string} nodeBaseLink Node base link.
   * @param {object} ppkData? PPK data(is imported).
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async saveNodeAccount(nodeID, nodeData, nodeBaseLink, ppkData = undefined) {
    let data = {nodeID, nodeData, nodeBaseLink};

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
   * Edit node
   * @param {string} nodeAccountAddress Node address.
   * @param {Object} nodeData Node information
   * @param {string} nodeData.name - Name.
   * @param {string} nodeData.operator Operator.
   * @param {string} nodeData.contactEmail Contact Email.
   * @param {string} nodeData.description Description.
   * @param {string} nodeData.icon Icon (string in base64 format).
   * @param {string} nodeData.user User Email.
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
   * Get network node.
   *
   * @param {string} nodeAddress Node address in hex.
   *
   * @returns {Promise|Promise<*>}
   */
  getNetworkNode(nodeAddress) {
    return axios
      .get(this._getURL(`network/${nodeAddress}`))
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
  getStakedNodeSummary() {
    return axios
      .get(this._getURL("summary/staked"))
      .then((response) => response.data);
  }

  /**
   * Get all available nodes.
   *
   * @param {number} limit Limit of query.
   * @param {number} offset Offset of query.
   *
   * @return {Promise|Promise<Array.<*>>}
   */
  getAllNodes(limit, offset = 0) {
    const params = {limit, offset};

    return axios
      .get(this._getURL(""), {params})
      .then((response) => response.data);
  }

  getAllUserNodes(user, limit, offset = 0) {
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
   * Delete a node from dashboard (but not from the network).
   *
   * @param {string} nodeAccountAddress Node account address.
   * @param {string} userEmail User email address.
   * @param {string} nodesLink Nodes links.
   *
   * @returns {Promise|Promise<*>}
   */
  deleteNodeFromDashboard(nodeAccountAddress, userEmail, nodesLink) {
    const data = {user: userEmail, nodesLink};

    return axios
      .post(this._getURL(`/${nodeAccountAddress}`), data)
      .then((response) => response.data);
  }

  /**
   * Stake a node.
   *
   * @param {string} transactionHash Transaction hash.
   * @param {string[]} networkChains Node network chains.
   * @param {string} paymentId payment's stripe confirmation id.
   * @param {string} nodeLink Link to detail for email.
   *
   * @returns {Promise|Promise<*>}
   */
  stakeNode(nodeStakeTransaction, paymentId, nodeLink) {
    const data = {
      nodeStakeTransaction,
      payment: {id: paymentId},
      nodeLink,
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
   * Unstake a node
   *
   * @param {string} transactionHash Transaction hash.
   * @param {string} nodeLink Link to detail for email.
   *
   * @returns {Promise|Promise<*>}
   */
  unstakeNode(nodeUnstakeTransaction, nodeLink) {
    const data = {nodeUnstakeTransaction, nodeLink};

    return axios
      .post(this._getURL("custom/unstake"), data)
      .then((response) => {
        return {success: true, data: response.data};
      })
      .catch((err) => {
        return {success: false, data: err.response};
      });
  }

  /**
   * Unjail a jailed node
   * @param {string} transactionHash Transaction hash.
   * @param {string} nodeLink Link to detail for email.
   *
   * @returns {Promise|Promise<*>}
   */
  unjailNode(transactionHash, nodeLink) {
    const data = {transactionHash, nodeLink};

    return axios
      .post(this._getURL("/unjail"), data)
      .then((response) => response.data);
  }
}

export default new PocketNodeService();
