import {
  Account,
  Application,
  ApplicationParams,
  Configuration,
  HttpRpcProvider,
  Node,
  NodeParams,
  Pocket,
  PocketAAT,
  StakingStatus,
  Transaction
} from "@pokt-network/pocket-js";
import {Configurations} from "../_configuration";
import {PocketNetworkError} from "../models/Exceptions";

const POCKET_NETWORK_CONFIGURATION = Configurations.pocket_network;

const POCKET_CONFIGURATION = new Configuration(
  POCKET_NETWORK_CONFIGURATION.max_dispatchers, POCKET_NETWORK_CONFIGURATION.max_sessions, 0, POCKET_NETWORK_CONFIGURATION.request_timeout);

export const POKT_DENOMINATIONS = {
  pokt: 0,
  upokt: 6
};

/**
 * Retrieve a list of URL's from the configuration for the dispatchers
 *
 * @returns {URL[]} Dispatcher urls.
 */
function getPocketDispatchers() {
  const dispatchersStr = POCKET_NETWORK_CONFIGURATION.dispatchers ?? "";

  if (dispatchersStr === "") {
    return [];
  }
  return dispatchersStr.split(",").map(function (dispatcherURLStr) {
    return new URL(dispatcherURLStr);
  });
}

/**
 * Get the default pokt network nodes.
 *
 * @returns {{nodes:string[], rpcProvider: string}} List of default nodes.
 */
export function get_default_pocket_network() {
  return {
    nodes: POCKET_NETWORK_CONFIGURATION.nodes.main,
    rpcProvider: POCKET_NETWORK_CONFIGURATION.nodes.rpc_provider
  };
}

export default class PocketService {

  /**
   * @param {string[]} nodes List of nodes of Pokt network.
   * @param {string} rpcProvider RPC provider of Pokt network.
   */
  constructor(nodes, rpcProvider) {
    /**
     * @type {Pocket}
     * @private
     */
    this.__pocket = new Pocket(getPocketDispatchers(), undefined, POCKET_CONFIGURATION);
  }

  /**
   * Creates a new PocketRPCProvider that fetches Pocket blockchain data using Pocket Network nodes
   *
   * @returns {HttpRpcProvider} HTTP RPC Provider
   */
  async getHttpRPCProvider() {
    if (!this.httpRpcProvider) {
      const nodeIndex = Math.floor(Math.random() * POCKET_NETWORK_CONFIGURATION.max_dispatchers);
      const nodeDispatcher = getPocketDispatchers()[nodeIndex];

      this.httpRpcProvider = new HttpRpcProvider(nodeDispatcher);
    }
    return this.httpRpcProvider;
  }

  /**
   * Import an account to Pokt network using private key of the account.
   *
   * @param {string} privateKeyHex Private key of the account to import in hex.
   * @param {string} passphrase Passphrase used to generate the account.
   *
   * @returns {Promise<Account | Error>} A pocket account.
   * @deprecated using now PPK instead of private key
   */
  async importAccount(privateKeyHex, passphrase) {
    return this.__pocket.keybase.importAccount(Buffer.from(privateKeyHex, "hex"), passphrase);
  }

  /**
   * Import an account to Pokt network using ppk  of the account.
   *
   * @param {object} ppkData ppk of the account to import in raw string.
   * @param {string} passphrase Passphrase used to generate the account.
   *
   * @returns {Promise<Account | Error>} A pocket account.
   */
  async importAccountFromPPK(ppkData, passphrase) {
    return this.__pocket.keybase.importPPKFromJSON(passphrase, JSON.stringify(ppkData), passphrase);
  }

  /**
   * Export raw Private key of the account.
   *
   * @param {string} addressHex Address of account to export in hex.
   * @param {string} passphrase Passphrase used to generate the account.
   * @param {string} encoding Encoding used to encode the buffer of private key.
   *
   * @returns {Promise<string>} A Hex private key.
   */
  async exportRawAccount(addressHex, passphrase, encoding = "hex") {
    /** @type {Buffer} */
    const privateKey = await this.__pocket.keybase.exportAccount(addressHex, passphrase);

    return privateKey.toString(encoding);
  }

  /**
   * Get Transaction data;
   *
   * @param {string} transactionHash Transaction hash.
   *
   * @returns {Transaction} Transaction data.
   * @async
   */
  async getTransaction(transactionHash) {
    const pocketRpcProvider = await this.getHttpRPCProvider();
    const transactionResponse = await this.__pocket.rpc(pocketRpcProvider).query.getTX(transactionHash);

    if (transactionResponse instanceof Error) {
      throw transactionResponse;
    }

    return transactionResponse.transaction;
  }

  /**
   * Check if account has sufficient balance.
   *
   * @param {string} accountAddress Account address to query.
   * @param {boolean} throwError If true throw the response error.
   *
   * @returns {Promise<string>} The account balance.
   * @async
   */
  async getBalance(accountAddress, throwError = true) {
    const pocketRpcProvider = await this.getHttpRPCProvider();
    const accountQueryResponse = await this.__pocket.rpc(pocketRpcProvider).query.getBalance(accountAddress);

    if (accountQueryResponse instanceof Error) {
      if (throwError) {
        throw accountQueryResponse;
      }

      return "0";
    }

    return accountQueryResponse.balance.toString();
  }

  /**
   * Get an Application Authentication Token to be used on Pokt network.
   *
   * @param {string} clientPublicKey The client Pocket account public key.
   * @param {Account} applicationAccount The funded application Pocket account.
   * @param {string} applicationAccountPassphrase The passphrase used to generate application address.
   *
   * @returns {Promise<PocketAAT>} An application authorization tokens.
   */
  async getApplicationAuthenticationToken(clientPublicKey, applicationAccount, applicationAccountPassphrase) {
    const aatVersion = POCKET_NETWORK_CONFIGURATION.aat_version;

    const applicationPublicKeyHex = applicationAccount.publicKey.toString("hex");
    const applicationPrivateKeyHex = await this.exportRawAccount(applicationAccount.addressHex, applicationAccountPassphrase);

    return PocketAAT.from(aatVersion, clientPublicKey, applicationPublicKeyHex, applicationPrivateKeyHex);
  }

  /**
   * Get Application data.
   *
   * @param {string} addressHex Account address.
   * @param {boolean} throwError If true throw the response error.
   *
   * @returns {Application} The account data.
   * @throws {PocketNetworkError} If Query fails.
   * @async
   */
  async getApplication(addressHex, throwError = true) {
    const pocketRpcProvider = await this.getHttpRPCProvider();
    const applicationResponse = await this.__pocket.rpc(pocketRpcProvider).query.getApp(addressHex);

    if (applicationResponse instanceof Error) {
      if (throwError) {
        throw new PocketNetworkError(applicationResponse.message);
      }

      return undefined;
    }

    return applicationResponse.application;
  }

  /**
   * Get node data.
   *
   * @param {string} addressHex Account address.
   *
   * @returns {Node} The account data.
   * @throws {PocketNetworkError} If Query fails.
   * @async
   */
  async getNode(addressHex) {
    const pocketRpcProvider = await this.getHttpRPCProvider();
    const nodeResponse = await this.__pocket.rpc(pocketRpcProvider).query.getNode(addressHex);

    if (nodeResponse instanceof Error) {
      throw new PocketNetworkError(nodeResponse.message);
    }

    return nodeResponse.node;
  }

  /**
   * Get Applications data.
   *
   * @param {number} status Status of the apps to retrieve.
   *
   * @returns {Promise<Application[]>} The applications data.
   * @async
   */
  async getApplications(status) {
    const pocketRpcProvider = await this.getHttpRPCProvider();
    const applicationsResponse = await this.__pocket.rpc(pocketRpcProvider).query.getApps(status);

    if (applicationsResponse instanceof Error) {
      return [];
    }

    return applicationsResponse.applications;
  }

  /**
   * Get All applications data.
   *
   * @param {string[]} [appAddresses] Application addresses.
   *
   * @returns {Promise<Application[]>} The applications data.
   * @async
   */
  async getAllApplications(appAddresses = []) {
    const stakedApplications = await this.getApplications(StakingStatus.Staked);
    const unstakingApplications = await this.getApplications(StakingStatus.Unstaking);

    const allApplications = stakedApplications
      .concat(unstakingApplications);

    if (appAddresses === undefined) {
      return allApplications;
    }

    if (appAddresses.length > 0) {
      return allApplications.filter(app => appAddresses.includes(app.address));
    }

    return [];
  }

  /**
   * Get Nodes data.
   *
   * @param {number} status Status of the nodes to retrieve.
   *
   * @returns {Promise<Node[]>} The nodes data.
   * @async
   */
  async getNodes(status) {
    const pocketRpcProvider = await this.getHttpRPCProvider();
    const nodesResponse = await this.__pocket.rpc(pocketRpcProvider).query.getNodes(status);

    if (nodesResponse instanceof Error) {
      return [];
    }

    return nodesResponse.nodes;
  }

  /**
   * Get All nodes data.
   *
   * @param {string[]} [nodeAddresses] Node addresses.
   *
   * @returns {Promise<Node[]>} The nodes data.
   * @async
   */
  async getAllNodes(nodeAddresses = []) {
    const stakedNodes = await this.getNodes(StakingStatus.Staked);
    const unstakingNodes = await this.getNodes(StakingStatus.Unstaking);

    const allNodes = stakedNodes
      .concat(unstakingNodes);

    if (nodeAddresses === undefined) {
      return allNodes;
    }

    if (nodeAddresses.length > 0) {
      return allNodes.filter(node => nodeAddresses.includes(node.address));
    }

    return [];
  }

  /**
   * Get Application Parameters data.
   *
   * @returns {Promise<ApplicationParams>} The application parameters.
   * @throws {PocketNetworkError} If Query fails.
   * @async
   */
  async getApplicationParameters() {
    const pocketRpcProvider = await this.getHttpRPCProvider();
    const applicationParametersResponse = await this.__pocket.rpc(pocketRpcProvider).query.getAppParams();

    if (applicationParametersResponse instanceof Error) {
      throw new PocketNetworkError(applicationParametersResponse.message);
    }

    return applicationParametersResponse.applicationParams;
  }

  /**
   * Get Node Parameters data.
   *
   * @returns {Promise<NodeParams>} The node parameters.
   * @throws {PocketNetworkError} If Query fails.
   * @async
   */
  async getNodeParameters() {
    const pocketRpcProvider = await this.getHttpRPCProvider();
    const nodeParametersResponse = await this.__pocket.rpc(pocketRpcProvider).query.getNodeParams();

    if (nodeParametersResponse instanceof Error) {
      throw new PocketNetworkError(nodeParametersResponse.message);
    }

    return nodeParametersResponse.nodeParams;
  }

  /**
   * Stake an application in pocket network.
   *
   * @param {string} transactionHash Transaction.
   *
   * @throws Error if transaction fails.
   */
  async stakeApplication(transactionHash) {
    // TODO: Use the transaction.
  }

  /**
   * Stake a node in pocket network.
   *
   * @param {string} transactionHash Transaction.
   *
   * @throws Error if transaction fails.
   */
  async stakeNode(transactionHash) {
    // TODO: Use the transaction.
  }

  /**
   * Unstake an application in pocket network.
   *
   * @param {string} transactionHash Transaction.
   *
   * @throws Error if transaction fails.
   */
  async unstakeApplication(transactionHash) {
    // TODO: Use the transaction.
  }

  /**
   * Unstake a node in pocket network.
   *
   * @param {string} transactionHash Transaction.
   *
   * @throws Error if transaction fails.
   */
  async unstakeNode(transactionHash) {
    // TODO: Use the transaction.
  }

  /**
   * UnJail a node in pocket network.
   *
   * @param {Account} nodeAccount Node account to unJail.
   * @param {string} passPhrase Passphrase used to import the account.
   *
   * @throws Error if transaction fails.
   */
  async unJailNode(nodeAccount, passPhrase) {
    // TODO: Use the transaction.
  }
}
