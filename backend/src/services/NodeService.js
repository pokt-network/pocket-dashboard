import UserService from "./UserService";
import {Node, StakingStatus} from "@pokt-network/pocket-js";
import {PrivatePocketAccount, PublicPocketAccount} from "../models/Account";
import {ExtendedPocketNode, PocketNode, RegisteredPocketNode, StakedNodeSummary, UserPocketNode} from "../models/Node";
import BasePocketService from "./BasePocketService";
import bigInt from "big-integer";
import {DashboardError, DashboardValidationError} from "../models/Exceptions";
import {POST_ACTION_TYPE, TransactionPostAction} from "../models/Transaction";

const NODE_COLLECTION_NAME = "Nodes";

export default class NodeService extends BasePocketService {

  constructor() {
    super();

    this.userService = new UserService();
  }

  /**
   * Persist node on db if not exists.
   *
   * @param {PocketNode} node Node to persist.
   *
   * @returns {Promise<string | boolean>} If node was was persisted return id, if not return false.
   * @private
   * @async
   */
  async __persistNodeIfNotExists(node) {
    if (!await this.nodeExists(node)) {
      /** @type {{insertedId: string, result: {n:number, ok: number}}} */
      const result = await this.persistenceService.saveEntity(NODE_COLLECTION_NAME, node);

      return result.result.ok === 1 ? result.insertedId : "0";
    }

    return false;
  }

  /**
   * Update node on db if exists.
   *
   * @param {PocketNode} node Node to update.
   *
   * @returns {Promise<boolean>} If node was updated or not.
   * @private
   * @async
   */
  async __updatePersistedNode(node) {
    if (await this.nodeExists(node)) {
      const filter = {
        "publicPocketAccount.address": node.publicPocketAccount.address
      };

      delete node.id;

      /** @type {{result: {n:number, ok: number}}} */
      const result = await this.persistenceService.updateEntity(NODE_COLLECTION_NAME, filter, node);

      return result.result.ok === 1;
    }

    return false;
  }

  /**
   * Update node on db by ID.
   *
   * @param {string} nodeID Node ID.
   * @param {PocketNode} nodeData Node data.
   *
   * @returns {Promise<boolean>} If node was updated or not.
   * @private
   * @async
   */
  async __updateNodeByID(nodeID, nodeData) {
    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.updateEntityByID(NODE_COLLECTION_NAME, nodeID, nodeData);

    return result.result.ok === 1;
  }

  /**
   *
   * @param {PocketNode} node Node to add pocket data.
   *
   * @returns {Promise<ExtendedPocketNode>} Pocket node with pocket data.
   * @private
   * @async
   */
  async __getExtendedPocketNode(node) {
    /** @type {Node} */
    let networkNode;

    try {
      networkNode = await this.pocketService.getNode(node.publicPocketAccount.address);
    } catch (e) {
      const nodeParameters = await this.pocketService.getNodeParameters();

      // noinspection JSValidateTypes
      networkNode = ExtendedPocketNode.createNetworkNode(node.publicPocketAccount, nodeParameters);
    }

    return ExtendedPocketNode.createExtendedPocketNode(node, networkNode);
  }

  /**
   * Check if node exists on DB.
   *
   * @param {PocketNode} node Node to check if exists.
   *
   * @returns {Promise<boolean>} If node exists or not.
   * @async
   */
  async nodeExists(node) {
    let filter = {};

    if (node.publicPocketAccount.address) {
      filter["publicPocketAccount.address"] = node.publicPocketAccount.address;
    } else {
      filter["name"] = node.name;
    }

    const dbNode = await this.persistenceService.getEntityByFilter(NODE_COLLECTION_NAME, filter);

    return dbNode !== undefined;
  }


  /**
   * Create an node on network.
   *
   * @param {object} nodeData Node data.
   * @param {string} nodeData.name Name.
   * @param {string} nodeData.contactEmail E-mail.
   * @param {string} nodeData.user User.
   * @param {string} [nodeData.operator] Operator.
   * @param {string} [nodeData.description] Description.
   * @param {string} [nodeData.icon] Icon.
   * @param {string} [privateKey] Node private key if is imported.
   *
   * @returns {Promise<{privateNodeData: PrivatePocketAccount, networkData:Node}>} Node information.
   * @throws {DashboardError | DashboardValidationError} If validation fails or already exists.
   * @async
   */
  async createNode(nodeData, privateKey = "") {
    if (PocketNode.validate(nodeData)) {
      if (!await this.userService.userExists(nodeData.user)) {
        throw new DashboardError("User does not exist");
      }

      const node = PocketNode.createPocketNode(nodeData);

      if (await this.nodeExists(node)) {
        throw new DashboardError("Node already exists");
      }

      return this.__persistNodeIfNotExists(node);
    }
  }

  /**
   * Update node on db by ID.
   *
   * @param {string} nodeID Node ID.
   * @param {PocketNode} nodeData Node data.
   *
   * @returns {Promise<boolean>} If node was updated or not.
   * @private
   * @async
   */
  async updateNodeData(nodeID, nodeData) {
    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.updateEntityByID(NODE_COLLECTION_NAME, nodeID, nodeData);

    return result.result.ok === 1;
  }

  /**
   * Create a node account.
   *
   * @param {string} nodeID Node ID.
   * @param {{address: string, publicKey: string}} accountData Node account data.
   *
   * @returns {Promise<PocketNode>} A node information.
   * @throws {Error} If node does not exists.
   * @async
   */
  async createNodeAccount(nodeID, accountData) {
    const nodeDB = await this.persistenceService.getEntityByID(NODE_COLLECTION_NAME, nodeID);

    if (!nodeDB) {
      throw new DashboardError("Node does not exists");
    }

    const node = PocketNode.createPocketNode(nodeDB);

    node.publicPocketAccount = new PublicPocketAccount(accountData.address, accountData.publicKey);

    await this.__updateNodeByID(nodeID, node);

    return node;
  }

  /**
   * Import node data from network.
   *
   * @param {string} nodeAddress Node address.
   *
   * @returns {Promise<Node>} Node data.
   * @throws Error If node already exists on dashboard or node does exist on network.
   * @async
   */
  async importNode(nodeAddress) {
    const filter = {
      "publicPocketAccount.address": nodeAddress
    };

    const nodeDB = await this.persistenceService.getEntityByFilter(NODE_COLLECTION_NAME, filter);

    if (nodeDB) {
      throw Error("Node already exists in dashboard");
    }

    try {
      return this.pocketService.getNode(nodeAddress);
    } catch (e) {
      throw TypeError("Node does not exist on network");
    }
  }

  /**
   * Get node data.
   *
   * @param {string} nodeAddress Node address.
   *
   * @returns {Promise<ExtendedPocketNode>} Node data.
   * @async
   */
  async getNode(nodeAddress) {
    const filter = {
      "publicPocketAccount.address": nodeAddress
    };

    const nodeDB = await this.persistenceService.getEntityByFilter(NODE_COLLECTION_NAME, filter);

    if (nodeDB) {
      const node = PocketNode.createPocketNode(nodeDB);

      return this.__getExtendedPocketNode(node);
    }

    return null;
  }

  /**
   * Get node data on network.
   *
   * @param {string} nodeAddress Node address.
   *
   * @returns {Promise<Node>} Node data.
   * @async
   */
  async getNetworkNode(nodeAddress) {
    return this.pocketService.getNode(nodeAddress);
  }

  /**
   * Verify if the node belongs to the client's account using an node information
   *
   * @param {string} nodeAddress Node Address.
   * @param {string} authHeader Authorization header.
   *
   * @returns {Promise<boolean>} True if the node belongs to the client account or false otherwise.
   * @async
   */
  async verifyNodeBelongsToClient(nodeAddress, authHeader) {
    // Retrieve the session tokens from the auth headers
    const accessToken = authHeader.split(", ")[0].split(" ")[1];
    const userEmail = authHeader.split(", ")[2].split(" ")[1];

    if (accessToken && userEmail) {
      const payload = await this.userService.decodeToken(accessToken, true);

      if (payload instanceof DashboardValidationError) {
        throw payload;
      }
      // Use token email to retrieve the node
      const node = await this.getNode(nodeAddress);

      if (node.pocketNode.user.toString() === userEmail.toString()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Verify if the node belongs to the client's account using an node information
   *
   * @param {string} node Node Object.
   * @param {string} authHeader Authorization header.
   *
   * @returns {Promise<boolean>} True if the node belongs to the client account or false otherwise.
   * @async
   */
  async verifyNodeObjectBelongsToClient(node, authHeader) {
    // Retrieve the session tokens from the auth headers
    const accessToken = authHeader.split(", ")[0].split(" ")[1];
    const userEmail = authHeader.split(", ")[2].split(" ")[1];

    if (accessToken && userEmail) {
      const payload = await this.userService.decodeToken(accessToken, true);

      if (payload instanceof DashboardValidationError) {
        throw payload;
      }
      
      if (node.pocketNode.user.toString() === userEmail.toString()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Verify if the session token belongs to the client email account.
   *
   * @param {object} authHeader Authorization header object.
   * @param {string} userEmail Email provided by the client.
   *
   * @returns {Promise<boolean>} True or false.
   * @async
   */
  async verifySessionForClient(authHeader, userEmail) {
    return await this.userService.verifySessionForClient(authHeader, userEmail);
  }

  /**
   * Get all nodes on network.
   *
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @returns {RegisteredPocketNode[]} List of nodes.
   * @async
   */
  async getAllNodes(limit, offset = 0) {
    const networkApplications = await this.pocketService.getNodes(StakingStatus.Staked);

    return networkApplications.map(PocketNode.createRegisteredPocketNode);
  }

  /**
   * Get staked node summary from network.
   *
   * @returns {Promise<StakedNodeSummary>} Summary data of staked nodes.
   * @async
   */
  async getStakedNodeSummary() {
    try {
      const stakedNodes = await this.pocketService.getNodes(StakingStatus.Staked);

      const averageStaked = this._getAverageNetworkData(stakedNodes.map(node => Number(node.stakedTokens.toString())));

      // 1 VP = 1 POKT, so, the validator power value is the same for staked token.
      const averageValidatorPower = this._getAverageNetworkData(stakedNodes.map(node => bigInt(node.stakedTokens.toString())));
      const averageStakedResult = averageStaked / stakedNodes.length;

      return new StakedNodeSummary(stakedNodes.length.toString(), averageStakedResult.toString(), averageValidatorPower.toString());
    } catch (e) {
      return new StakedNodeSummary("0", "0", "0");
    }
  }


  /**
   * Get all nodes on network that belongs to user.
   *
   * @param {string} userEmail Email of user.
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @returns {Promise<UserPocketNode[]>} List of nodes.
   * @async
   */
  async getUserNodes(userEmail, limit, offset = 0) {
    const filter = {user: userEmail};

    const dashboardNodesData = (await this.persistenceService.getEntities(NODE_COLLECTION_NAME, filter, limit, offset))
      .map(PocketNode.createPocketNode)
      .map(node => {
        return {
          id: node.id,
          name: node.name,
          address: node.publicPocketAccount.address,
          icon: node.icon
        };
      });

    const dashboardNodeAddresses = dashboardNodesData
      .map(node => node.address)
      .filter(address => address.length > 0);

    const networkNodes = await this.pocketService
      .getAllNodes(dashboardNodeAddresses);

    if (dashboardNodesData.length > 0) {
      return dashboardNodesData
        .map(node => PocketNode.createUserPocketNode(node, networkNodes));
    }

    return [];
  }

  /**
   * Stake a node on network.
   *
   * @param {string} nodeAddress Node address in hex.
   * @param {string} upoktToStake uPOKT amount to stake.
   * @param {{address: string, raw_hex_bytes: string}} nodeStakeTransaction Stake transaction.
   * @param {ExtendedPocketNode} node Node to stake.
   * @param {{name: string, raw_hex_bytes: string}} emailData Email data.
   * @param {object} paymentEmailData Payment email data.
   *
   * @returns {Promise<PocketNode | boolean>} If was staked return the node, if not return false.
   * @throws Error If private key is not valid or node does not exists on dashboard.
   * @async
   */
  async stakeNode(nodeAddress, upoktToStake, nodeStakeTransaction, node, emailData, paymentEmailData) {
    // First transfer funds from the main fund
    const fundingTransactionHash = await this.pocketService.transferFromMainFund(upoktToStake, nodeAddress);

    // Create post confirmation action to stake node
    const contactEmail = node.pocketNode.contactEmail;
    const nodeStakeAction = new TransactionPostAction(POST_ACTION_TYPE.stakeNode, {
      nodeStakeTransaction,
      contactEmail,
      emailData,
      paymentEmailData
    });

    // Create job to monitor transaction confirmation
    const result = await this.transactionService.addTransferTransaction(fundingTransactionHash, nodeStakeAction);

    if (!result) {
      throw new Error("Couldn't add funding transaction for processing");
    }

    node.pocketNode.updatingStatus = true;

    await this.__updatePersistedNode(node.pocketNode);
  }

  /**
   * Unstake node.
   *
   * @param {object} nodeUnstakeTransaction Transaction object.
   * @param {string} nodeUnstakeTransaction.address Sender address
   * @param {string} nodeUnstakeTransaction.raw_hex_bytes Raw transaction bytes
   * @param {string} nodeLink Link to detail for email.
   * @param {string} authHeader Auth header.
   *
   * @async
   */
  async unstakeNode(nodeUnstakeTransaction, nodeLink, authHeader) {
    const {
      address,
      raw_hex_bytes: rawHexBytes
    } = nodeUnstakeTransaction;

    // Retrieve the node information
    const node = await this.getNode(address);

    if(node === undefined || node === null) {
      throw new Error(`Couldn't find a node with this address: ${address}`);
    }

    // Check if the node belogns to the client
    if (await this.verifyNodeObjectBelongsToClient(node, authHeader)) {
      // Submit transaction
      const nodeUnstakedHash = await this.pocketService.submitRawTransaction(address, rawHexBytes);

      // Gather email data
      const emailData = {
        userName: node.pocketNode.user,
        contactEmail: node.pocketNode.contactEmail,
        nodeData: {
          name: node.pocketNode.name,
          link: nodeLink
        }
      };

      // Add transaction to queue
      const result = await this.transactionService.addNodeUnstakeTransaction(nodeUnstakedHash, emailData);

      if (!result) {
        throw new Error("Couldn't register app unstake transaction for email notification");
      }

      node.pocketNode.updatingStatus = false;

      await this.__updatePersistedNode(node.pocketNode);
    } else {
      throw new Error("Node doesn't belong to the provided client account.");
    }
  }

  /**
   * UnJail node.
   *
   * @param {{address: string, raw_hex_bytes: string}} unJailTransaction Transaction to unjail.
   * @param {{userName: string, contactEmail: string, nodeData: {name: string, link: string}}} emailData Email data.
   *
   * @async
   */
  async unJailNode(unJailTransaction, emailData) {
    const {
      address,
      raw_hex_bytes: rawHexBytes
    } = unJailTransaction;

    // Submit transaction
    const nodeUnJailHash = await this.pocketService.submitRawTransaction(address, rawHexBytes);

    // Add transaction to queue
    const result = await this.transactionService.addNodeUnJailTransaction(nodeUnJailHash, emailData);

    if (!result) {
      throw new Error("Couldn't register app unjail transaction for email notification");
    }
  }

  /**
   * Delete a node from dashboard(not from network).
   *
   * @param {string} nodeAccountAddress Node account address.
   * @param {string} user Owner email of node.
   *
   * @returns {Promise<PocketNode>} The deleted node.
   * @async
   */
  async deleteNode(nodeAccountAddress, user) {
    const filter = {
      "publicPocketAccount.address": nodeAccountAddress,
      user
    };

    const nodeDB = await this.persistenceService.getEntityByFilter(NODE_COLLECTION_NAME, filter);

    await this.persistenceService.deleteEntities(NODE_COLLECTION_NAME, filter);

    return PocketNode.createPocketNode(nodeDB);
  }

  /**
   * Update a node on network.
   *
   * @param {string} nodeAccountAddress Node account address.
   * @param {object} nodeData Node data.
   * @param {string} nodeData.name Name.
   * @param {string} nodeData.contactEmail E-mail.
   * @param {string} nodeData.user User.
   * @param {string} [nodeData.operator] Operator.
   * @param {string} [nodeData.description] Description.
   * @param {string} [nodeData.icon] Icon.
   *
   * @returns {Promise<boolean>} If was updated or not.
   * @throws {DashboardError | DashboardValidationError} If validation fails or does not exists.
   * @async
   */
  async updateNode(nodeAccountAddress, nodeData) {
    if (PocketNode.validate(nodeData)) {
      if (!await this.userService.userExists(nodeData.user)) {
        throw new DashboardError("User does not exists");
      }

      const node = PocketNode.createPocketNode(nodeData);
      const filter = {
        "publicPocketAccount.address": nodeAccountAddress
      };

      const nodeDB = await this.persistenceService.getEntityByFilter(NODE_COLLECTION_NAME, filter);

      if (!nodeDB) {
        throw new DashboardError("Node does not exists");
      }

      const nodeToEdit = {
        ...node,
        publicPocketAccount: nodeDB.publicPocketAccount
      };

      return this.__updatePersistedNode(nodeToEdit);
    }
    return false;
  }
}
