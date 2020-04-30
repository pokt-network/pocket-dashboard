import {Node, NodeParams, StakingStatus} from "@pokt-network/pocket-js";
import {PublicPocketAccount} from "./Account";
import {EMAIL_REGEX} from "./Regex";

export class PocketNode {

  /**
   * @param {string} name Name.
   * @param {string} contactEmail A support contact email.
   * @param {string} user User that belong the application.
   * @param {string} [operator] Operator.
   * @param {string} [description] Description.
   * @param {string} [icon] Icon.
   */
  constructor(name, contactEmail, user, operator, description, icon) {
    Object.assign(this, {name, contactEmail, user, operator, description, icon});

    /** @type {PublicPocketAccount} */
    this.publicPocketAccount = null;
  }

  /**
   * Validate node data.
   *
   * @param {object} nodeData Node to create.
   * @param {string} nodeData.name Name.
   * @param {string} nodeData.contactEmail E-mail.
   * @param {string} nodeData.user User.
   * @param {string} [nodeData.operator] Operator.
   * @param {string} [nodeData.description] Description.
   * @param {string} [nodeData.icon] Icon.
   *
   * @returns {boolean} If is validation success
   * @throws {Error} If validation fails
   * @static
   */
  static validate(nodeData) {

    if (nodeData.name === "") {
      throw Error("Name is not valid.");
    }

    if (!EMAIL_REGEX.test(nodeData.contactEmail)) {
      throw Error("Contact email address is not valid.");
    }

    if (!EMAIL_REGEX.test(nodeData.user)) {
      throw Error("User is not valid.");
    }

    return true;
  }

  /**
   * Convenient Factory method to create a Pocket node.
   *
   * @param {object} nodeData Node to create.
   * @param {string} nodeData.name Name.
   * @param {string} nodeData.contactEmail E-mail.
   * @param {string} nodeData.user User.
   * @param {string} [nodeData.operator] Operator.
   * @param {string} [nodeData.description] Description.
   * @param {string} [nodeData.icon] Icon.
   * @param {PublicPocketAccount} [nodeData.publicPocketAccount] Public account data.
   *
   * @returns {PocketNode} New Pocket node.
   * @static
   */
  static createPocketNode(nodeData) {
    const {name, contactEmail, user, operator, description, icon, publicPocketAccount} = nodeData;
    const pocketNode = new PocketNode(name, contactEmail, user, operator, description, icon);

    pocketNode.publicPocketAccount = publicPocketAccount;

    return pocketNode;
  }
}

export class ExtendedPocketNode {

  /**
   * @param {PocketNode} pocketNode Pocket node.
   * @param {Node} networkData Node data from Pocket Network.
   */
  constructor(pocketNode, networkData) {
    Object.assign(this, {pocketNode, networkData});
  }

  /**
   * Convenient Factory method to create an extended pocket node.
   *
   * @param {PocketNode} pocketNode Node data.
   * @param {Node} nodeData Node data from Pocket Network.
   *
   * @returns {ExtendedPocketNode} A new Pocket node.
   * @static
   */
  static createExtendedPocketNode(pocketNode, nodeData) {
    return new ExtendedPocketNode(pocketNode, nodeData);
  }

  /**
   * Convenient Factory method to create network node.
   *
   * @param {PublicPocketAccount} publicPocketAccount Public pocket account.
   * @param {NodeParams} nodeParameters Node parameter from network.
   *
   * @returns {{address:string, publicKey:string, jailed:boolean, status:StakingStatus, chains:string[], stakedTokens: string, unstakingCompletionTime?: string}} Node.
   * @static
   */
  static createNetworkNode(publicPocketAccount, nodeParameters) {
    const {address, publicKey} = publicPocketAccount;

    return {
      address,
      publicKey,
      jailed: false,
      status: StakingStatus.Unstaked,
      chains: [],
      stakedTokens: "0",
      unstakingCompletionTime: nodeParameters.unstakingTime
    };
  }
}
