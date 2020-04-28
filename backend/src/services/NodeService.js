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
    const filter = {name: node.name, operator: node.operator};
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
}
