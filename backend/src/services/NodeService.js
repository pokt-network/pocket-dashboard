import BaseService from "./BaseService";
import UserService from "./UserService";
import {Node, StakingStatus} from "@pokt-network/pocket-js";
import {PrivatePocketAccount, PublicPocketAccount} from "../models/Account";
import {ExtendedPocketNode, PocketNode} from "../models/Node";
import AccountService from "./AccountService";

const NODE_COLLECTION_NAME = "Nodes";

export default class NodeService extends BaseService {

  constructor() {
    super();

    this.userService = new UserService();
  }

  /**
   * Persist node on db if not exists.
   *
   * @param {PocketNode} node Node to persist.
   *
   * @returns {Promise<boolean>} If node was persisted or not.
   * @private
   * @async
   */
  async __persistNodeIfNotExists(node) {
    if (!await this.nodeExists(node)) {
      /** @type {{result: {n:number, ok: number}}} */
      const result = await this.persistenceService.saveEntity(NODE_COLLECTION_NAME, node);

      return result.result.ok === 1;
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

      /** @type {{result: {n:number, ok: number}}} */
      const result = await this.persistenceService.updateEntity(NODE_COLLECTION_NAME, filter, node);

      return result.result.ok === 1;
    }

    return false;
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
   *
   * @param {PocketNode[]} nodes Nodes to add pocket data.
   *
   * @returns {Promise<ExtendedPocketNode[]>} Pocket nodes with pocket data.
   * @private
   * @async
   */
  async __getExtendedPocketNodes(nodes) {
    const extendedNodes = nodes.map(async (node) => this.__getExtendedPocketNode(node));

    return Promise.all(extendedNodes);
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

    if (node.publicPocketAccount) {
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
   * @throws {Error} If validation fails or already exists.
   * @async
   */
  async createNode(nodeData, privateKey = "") {
    if (PocketNode.validate(nodeData)) {
      if (!await this.userService.userExists(nodeData.user)) {
        throw new Error("User does not exist");
      }

      const node = PocketNode.createPocketNode(nodeData);

      if (await this.nodeExists(node)) {
        throw new Error("Node already exists");
      }
      const accountService = new AccountService();
      const passPhrase = await accountService.generatePassphrase(node.name);
      const pocketAccount = await accountService.createPocketAccount(this.pocketService, passPhrase, privateKey);

      node.publicPocketAccount = PublicPocketAccount.createPublicPocketAccount(pocketAccount);

      await this.__persistNodeIfNotExists(node);

      const nodeParameters = await this.pocketService.getNodeParameters();

      const privateNodeData = await PrivatePocketAccount.createPrivatePocketAccount(this.pocketService, pocketAccount, passPhrase);
      const networkData = ExtendedPocketNode.createNetworkNode(node.publicPocketAccount, nodeParameters);

      // noinspection JSValidateTypes
      return {privateNodeData, networkData};
    }
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
   * Get all nodes on network.
   *
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   * @param {number} [stakingStatus] Staking status filter.
   *
   * @returns {ExtendedPocketNode[]} List of nodes.
   * @async
   */
  async getAllNodes(limit, offset = 0, stakingStatus = undefined) {
    const nodes = (await this.persistenceService.getEntities(NODE_COLLECTION_NAME, {}, limit, offset))
      .map(PocketNode.createPocketNode);

    if (nodes) {
      const extendedNodes = await this.__getExtendedPocketNodes(nodes);

      if (stakingStatus !== undefined) {
        return extendedNodes.filter((node) => node.networkData.status === StakingStatus.getStatus(stakingStatus));
      }
      return extendedNodes;
    }

    return [];
  }

  /**
   * Get all nodes on network that belongs to user.
   *
   * @param {string} userEmail Email of user.
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   * @param {number} [stakingStatus] Staking status filter.
   *
   * @returns {Promise<ExtendedPocketNode[]>} List of nodes.
   * @async
   */
  async getUserNodes(userEmail, limit, offset = 0, stakingStatus = undefined) {
    const filter = {user: userEmail};
    const nodes = (await this.persistenceService.getEntities(NODE_COLLECTION_NAME, filter, limit, offset))
      .map(PocketNode.createPocketNode);

    if (nodes) {
      const extendedNodes = await this.__getExtendedPocketNodes(nodes);

      if (stakingStatus !== undefined) {
        return extendedNodes.filter((node) => node.networkData.status === StakingStatus.getStatus(stakingStatus));
      }

      return extendedNodes;
    }

    return [];
  }


  /**
   * Stake a node on network.
   *
   * @param {{privateKey: string, networkChains: string[], serviceURL: string}} node Node to stake.
   * @param {string} uPoktAmount uPokt amount used to stake.
   *
   * @returns {Promise<boolean>} If was staked or not.
   * @throws Error If private key is not valid or node does not exists on dashboard.
   */
  async stakeNode(node, uPoktAmount) {
    const accountService = new AccountService();
    const passPhrase = "StakePocketNode";

    const nodeAccount = await accountService.importAccountToNetwork(this.pocketService, passPhrase, node.privateKey);

    const filter = {
      "publicPocketAccount.address": nodeAccount.addressHex
    };

    const nodeDB = await this.persistenceService.getEntityByFilter(NODE_COLLECTION_NAME, filter);

    if (!nodeDB) {
      throw Error("Node does not exists on dashboard");
    }

    try {
      // Stake node
      const serviceURL = new URL(node.serviceURL);
      const transaction = await this.pocketService.stakeNode(nodeAccount, passPhrase, uPoktAmount, node.networkChains, serviceURL);

      return transaction.tx !== undefined;
    } catch (e) {
      return false;
    }
  }

  /**
   * Unstake node.
   *
   * @param {string} nodeAccountAddress Node account address.
   *
   * @returns {Promise<boolean>} If node was unstaked or not.
   * @async
   */
  async unstakeNode(nodeAccountAddress) {
    const filter = {
      "publicPocketAccount.address": nodeAccountAddress
    };

    const nodeDB = await this.persistenceService.getEntityByFilter(NODE_COLLECTION_NAME, filter);

    if (!nodeDB) {
      return false;
    }

    try {
      const passphrase = "UnstakeNode";
      const nodeAccount = await this.pocketService.getAccount(nodeAccountAddress);

      // Unstake node
      await this.pocketService.unstakeNode(nodeAccount, passphrase);

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Delete a node from dashboard(not from network).
   *
   * @param {string} nodeAccountAddress Node account address.
   *
   * @returns {Promise<boolean>} If node was deleted or not.
   * @async
   */
  async deleteNode(nodeAccountAddress) {
    const filter = {
      "publicPocketAccount.address": nodeAccountAddress
    };

    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.deleteEntities(NODE_COLLECTION_NAME, filter);

    return result.result.ok === 1;
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
   * @throws {Error} If validation fails or does not exists.
   * @async
   */
  async updateNode(nodeAccountAddress, nodeData) {
    if (PocketNode.validate(nodeData)) {
      if (!await this.userService.userExists(nodeData.user)) {
        throw new Error("User does not exists");
      }

      const node = PocketNode.createPocketNode(nodeData);
      const filter = {
        "publicPocketAccount.address": nodeAccountAddress
      };

      const nodeDB = await this.persistenceService.getEntityByFilter(NODE_COLLECTION_NAME, filter);

      if (!nodeDB) {
        throw new Error("Node does not exists");
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
