import {
  Account,
  Application,
  ApplicationParams,
  Configuration,
  HttpRpcProvider,
  Node,
  NodeParams,
  Pocket,
  StakingStatus,
  Transaction,
  typeGuard,
  RpcError
} from "@pokt-network/pocket-js";
import { Configurations } from "../_configuration";
import { PocketNetworkError } from "../models/Exceptions";

const POCKET_NETWORK_CONFIGURATION = Configurations.pocket_network;

const POCKET_CONFIGURATION = new Configuration(
  POCKET_NETWORK_CONFIGURATION.max_dispatchers,
  POCKET_NETWORK_CONFIGURATION.max_sessions,
  0,
  POCKET_NETWORK_CONFIGURATION.request_timeout
);

const POCKET_MAIN_FUND_ACCOUNT = POCKET_NETWORK_CONFIGURATION.main_fund_account;
const POCKET_MAIN_FUND_ADDRESS = POCKET_NETWORK_CONFIGURATION.main_fund_address;

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
  const dispatchersStr = POCKET_NETWORK_CONFIGURATION.dispatchers;
  console.log(`DISPATCHERS: ${dispatchersStr}`)

  if (dispatchersStr === "") {
    return [];
  }
  return dispatchersStr.split(",").map(function (dispatcherURLStr) {
    return new URL(dispatcherURLStr);
  });
}

async function getPocketRPCProvider() {
  throw new Error("TODO IMPLEMENT THIS")
}

function getHttpRPCProvider() {
  const httpProviderNode = POCKET_NETWORK_CONFIGURATION.http_provider_node;
  if (!httpProviderNode || httpProviderNode === "") {
    throw new Error("Invalid HTTP Provider Node: " + httpProviderNode)
  }
  return new HttpRpcProvider(new URL(httpProviderNode))
}

async function getRPCProvider() {
  const providerType = POCKET_NETWORK_CONFIGURATION.provider_type;
  if (providerType.toLowerCase() === "http") {
    return getHttpRPCProvider();
  } else if (providerType.toLowerCase() === "pocket") {
    return getPocketRPCProvider();
  } else {
    // Default to HTTP RPC Provider
    return getHttpRPCProvider();
  }
}

export default class PocketService {

  /**
   * @param {string[]} nodes List of nodes of Pokt network.
   * @param {string} rpcProvider RPC provider of Pokt network.
   */
  constructor() {
    /**
     * @type {Pocket}
     * @private
     */
    this.__pocket = new Pocket(
      getPocketDispatchers(),
      undefined,
      POCKET_CONFIGURATION
    );
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
   * Get Transaction data;
   *
   * @param {string} transactionHash Transaction hash.
   *
   * @returns {Transaction} Transaction data.
   * @async
   */
  async getTransaction(transactionHash) {
    const pocketRpcProvider = await getRPCProvider();
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
    const pocketRpcProvider = await getRPCProvider();
    const accountQueryResponse = await this.__pocket.rpc(pocketRpcProvider).query.getBalance(accountAddress);

    if (accountQueryResponse instanceof Error) {
      if (throwError) {
        throw accountQueryResponse;
      }

      return "0";
    }

    if (!accountQueryResponse.balance) {
      return "0";
    } else {
      return accountQueryResponse.balance.toString();
    }
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
    const pocketRpcProvider = await getRPCProvider();
    console.log(addressHex);
    const applicationResponse = await this.__pocket.rpc(pocketRpcProvider).query.getApp(addressHex);
    console.log(applicationResponse);
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
    const pocketRpcProvider = await getRPCProvider();
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
    const pocketRpcProvider = await getRPCProvider();
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
    const pocketRpcProvider = await getRPCProvider();
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
    const pocketRpcProvider = await getRPCProvider();
    const applicationParametersResponse = await this.__pocket.rpc(pocketRpcProvider).query.getAppParams();

    console.error(applicationParametersResponse);
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
    const pocketRpcProvider = await getRPCProvider();
    const nodeParametersResponse = await this.__pocket.rpc(pocketRpcProvider).query.getNodeParams();

    if (nodeParametersResponse instanceof Error) {
      throw new PocketNetworkError(nodeParametersResponse.message);
    }

    return nodeParametersResponse.nodeParams;
  }


  async submitRawTransaction(fromAddress, rawTxBytes) {
    const pocketRpcProvider = await getRPCProvider();
    const rawTxResponse = await this.__pocket.rpc(pocketRpcProvider).client.rawtx(fromAddress, rawTxBytes);

    if (typeGuard(rawTxResponse, RpcError)) {
      throw new PocketNetworkError(rawTxResponse.message)
    }

    return rawTxResponse.hash
  }

  /**
   * Transfer funds from the Main Fund Account to the customer's Account
   * @param {string} amount Amount to transfer in uPOKT denomination
   * @param {string} customerAddress Receipient address
   * @throws {PocketNetworkError}
   * @returns {Promise<string>}
   */
  async transferFromMainFund(amount, customerAddress) {
    // Include transaction fee for the stake transaction
    const totalAmount = Number(amount) + 10000000;
    const pocketRpcProvider = await getRPCProvider();
    this.__pocket.rpc(pocketRpcProvider)
    const rawTxResponse = await this.__pocket
      .withPrivateKey(POCKET_MAIN_FUND_ACCOUNT)
      .send(POCKET_MAIN_FUND_ADDRESS, customerAddress, totalAmount.toString())
      .submit(POCKET_NETWORK_CONFIGURATION.chain_id, POCKET_NETWORK_CONFIGURATION.transaction_fee)

    if (typeGuard(rawTxResponse, RpcError)) {
      throw new PocketNetworkError(rawTxResponse.message)
    }

    return rawTxResponse.hash
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
