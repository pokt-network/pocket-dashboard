import { Node, NodeParams, StakingStatus } from "@pokt-network/pocket-js";
import { PublicPocketAccount } from "./Account";
import { EMAIL_REGEX } from "./Regex";
import { DashboardValidationError } from "./Exceptions";

export class RegisteredPocketNode {
  /**
   * @param {string} name Name.
   * @param {string} address Address.
   * @param {StakingStatus} status Status
   */
  constructor(name, address, status) {
    Object.assign(this, { name, address, status });
  }
}

export class UserPocketNode {
  /**
   * @param {string} id ID.
   * @param {string} name Name.
   * @param {string} address Address.
   * @param {string} icon Icon.
   * @param {string} stakedPOKT staked POKT.
   * @param {number} status Status.
   */
  constructor(id, name, address, icon, stakedPOKT, status) {
    Object.assign(this, { id, name, address, icon, stakedPOKT, status });
  }
}

export class PocketNode {
  /**
   * @param {string} name Name.
   * @param {string} contactEmail A support contact email.
   * @param {string} user User that belong the application.
   * @param {string} [operator] Operator.
   * @param {string} [description] Description.
   * @param {string} [icon] Icon.
   * @param {boolean} [updatingStatus] If is on staking status.
   */
  constructor(
    name,
    contactEmail,
    user,
    operator,
    description,
    icon,
    updatingStatus
  ) {
    Object.assign(this, {
      name,
      contactEmail,
      user,
      operator,
      description,
      icon,
      updatingStatus,
    });

    this.id = "";
    this.publicPocketAccount = new PublicPocketAccount("", "");
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
   * @throws {DashboardValidationError} If validation fails
   * @static
   */
  static validate(nodeData) {
    if (nodeData.name === "") {
      throw new DashboardValidationError("Name is not valid.");
    }

    if (nodeData.name.length > 20) {
      throw new DashboardValidationError(
        "Name length should not be greater than 20 character."
      );
    }

    if (nodeData.description !== "" && nodeData.description.length > 150) {
      throw new DashboardValidationError(
        "Description length should not be greater than 150 character."
      );
    }

    if (!EMAIL_REGEX.test(nodeData.contactEmail)) {
      throw new DashboardValidationError("Contact email address is not valid.");
    }

    if (!EMAIL_REGEX.test(nodeData.user)) {
      throw new DashboardValidationError("User is not valid.");
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
   * @param {string} [nodeData._id] Node ID.
   *
   * @returns {PocketNode} New Pocket node.
   * @static
   */
  static createPocketNode(nodeData) {
    const {
      name,
      contactEmail,
      user,
      operator,
      description,
      icon,
      publicPocketAccount,
      updatingStatus,
    } = nodeData;
    const pocketNode = new PocketNode(
      name,
      contactEmail,
      user,
      operator,
      description,
      icon,
      updatingStatus
    );

    pocketNode.id = nodeData._id ?? "";
    pocketNode.publicPocketAccount =
      publicPocketAccount ?? new PublicPocketAccount("", "");

    return pocketNode;
  }

  /**
   * Convenient Factory method to create a registered pocket node.
   *
   * @param {object} nodeData Node to create.
   * @param {string} nodeData.address Address.
   * @param {StakingStatus} nodeData.status Status.
   * @param {string} [nodeData.name] Name.
   *
   * @returns {RegisteredPocketNode} A new resumed pocket node.
   * @static
   */
  static createRegisteredPocketNode(nodeData) {
    const nodeName = nodeData.name ?? "N/A";

    return new RegisteredPocketNode(
      nodeName,
      nodeData.address,
      nodeData.status
    );
  }

  /**
   * Convenient Factory method to create an user pocket node.
   *
   * @param {object} nodeData Application to create.
   * @param {string} nodeData.id ID.
   * @param {string} nodeData.name Name.
   * @param {string} nodeData.address Address.
   * @param {string} nodeData.icon Icon.
   * @param {Node[]} networkNodes Nodes.
   *
   * @returns {UserPocketNode} A new user pocket node.
   * @static
   */
  static createUserPocketNode(nodeData, networkNodes) {
    const { id, name, address, icon } = nodeData;
    let networkNode = networkNodes.filter(
      (app) => app.address === nodeData.address
    );

    if (networkNode.length > 0) {
      networkNode = networkNode[0];

      return new UserPocketNode(
        id,
        name,
        address,
        icon,
        networkNode.stakedTokens.toString(),
        networkNode.status
      );
    }

    return new UserPocketNode(id, name, address, icon, "0", 0);
  }
}

export class ExtendedPocketNode {
  /**
   * @param {PocketNode} pocketNode Pocket node.
   * @param {Node} networkData Node data from Pocket Network.
   */
  constructor(pocketNode, networkData) {
    Object.assign(this, { pocketNode, networkData });
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
   * @returns {{address:string, publicKey:string, jailed:boolean, status:string, chains:string[], tokens: string, service_url: string, unstaking_time?: string}} Node.
   * @static
   */
  static createNetworkNode(publicPocketAccount, nodeParameters) {
    const { address, publicKey } = publicPocketAccount;

    return {
      address,
      publicKey,
      jailed: false,
      status: "0",
      service_url: "",
      chains: [],
      tokens: "0",
      unstaking_time: nodeParameters.unstakingTime.toString(),
    };
  }
}

export class StakedNodeSummary {
  /**
   * @param {string} totalNodes Total of Nodes.
   * @param {string} averageStaked Average of staked nodes.
   * @param {string} averageValidatorPower Average of validator power.
   */
  constructor(totalNodes, averageStaked, averageValidatorPower) {
    Object.assign(this, { totalNodes, averageStaked, averageValidatorPower });
  }
}
