import BaseService from "./BaseService";
import UserService from "./UserService";
import {Account, Node} from "@pokt-network/pocket-js";
import {PrivatePocketAccount, PublicPocketAccount} from "../models/Account";
import {ExtendedPocketNode, PocketNode} from "../models/Node";
import bcrypt from "bcrypt";

const NODE_COLLECTION_NAME = "Nodes";

export default class NodeService extends BaseService {

  constructor() {
    super();

    this.userService = new UserService();
  }

  /**
   * Generate a random passphrase.
   *
   * @param {PocketNode} node Node.
   *
   * @returns {string} A passphrase.
   * @private
   * @async
   */
  async __generatePassphrase(node) {
    const seed = 10;

    const now = new Date();
    const data = `${node.name} + ${now.toUTCString()}`;

    return await bcrypt.hash(data, seed);
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
   * Create a pocket account in the network.
   *
   * @param {string} passPhrase Passphrase used to create pocket account.
   *
   * @returns {Promise<Account> | Error} A Pocket account created successfully.
   * @throws {Error} If creation of account fails.
   * @private
   */
  async __createPocketAccount(passPhrase) {
    const account = await this.pocketService.createAccount(passPhrase);

    if (account instanceof Error) {
      throw account;
    }

    return account;
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
    const dbApplication = await this.persistenceService.getEntityByFilter(NODE_COLLECTION_NAME, filter);

    return dbApplication !== undefined;
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
   * @param {string} [privateKey] Application private key if is imported.
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

      const passPhrase = await this.__generatePassphrase(node);
      let pocketAccount;

      if (privateKey) {
        const account = await this.pocketService.importAccount(privateKey, passPhrase);

        if (account instanceof Error) {
          throw Error("Imported account is invalid");
        }

        pocketAccount = account;
      } else {
        // Generate Pocket account for node.
        pocketAccount = await this.__createPocketAccount(passPhrase);
      }

      node.publicPocketAccount = PublicPocketAccount.createPublicPocketAccount(pocketAccount);

      await this.__persistNodeIfNotExists(node);

      const nodeParameters = await this.pocketService.getNodeParameters();

      const privateNodeData = await PrivatePocketAccount.createPrivatePocketAccount(this.pocketService, pocketAccount, passPhrase);
      const networkData = ExtendedPocketNode.createNetworkNode(node.publicPocketAccount, nodeParameters);

      // noinspection JSValidateTypes
      return {privateNodeData, networkData};
    }
  }
}
