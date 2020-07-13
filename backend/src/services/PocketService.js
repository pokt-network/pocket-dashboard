import {
  Account,
  Application,
  ApplicationParams,
  Configuration,
  HttpRpcProvider,
  Node,
  NodeParams,
  Pocket,
  PocketRpcProvider,
  RpcError,
  StakingStatus,
  Transaction,
  typeGuard,
  UnlockedAccount
} from "@pokt-network/pocket-js";
import {Configurations} from "../_configuration";
import {PocketNetworkError} from "../models/Exceptions";
import bigInt from "big-integer";

const POCKET_NETWORK_CONFIGURATION = Configurations.pocket_network;

const POCKET_CONFIGURATION = new Configuration(
  POCKET_NETWORK_CONFIGURATION.max_dispatchers, POCKET_NETWORK_CONFIGURATION.max_sessions, 0, POCKET_NETWORK_CONFIGURATION.request_timeout
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

  if (dispatchersStr === "") {
    return [];
  }
  return dispatchersStr.split(",").map(function (dispatcherURLStr) {
    return new URL(dispatcherURLStr);
  });
}

/**
 *
 */
async function getPocketRPCProvider() {
  throw new Error("TODO IMPLEMENT THIS");
}

/**
 * @returns {HttpRpcProvider} HTTP RPC Provider.
 */
function getHttpRPCProvider() {
  const httpProviderNode = POCKET_NETWORK_CONFIGURATION.http_provider_node;

  if (!httpProviderNode || httpProviderNode === "") {
    throw new Error("Invalid HTTP Provider Node: " + httpProviderNode);
  }
  return new HttpRpcProvider(new URL(httpProviderNode));
}

/**
 * @returns {HttpRpcProvider | PocketRpcProvider} RPC Provider.
 */
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

  constructor() {
    /**
     * @type {Pocket}
     * @private
     */
    this.__pocket = new Pocket(
      getPocketDispatchers(), undefined, POCKET_CONFIGURATION
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
      throw new PocketNetworkError(rawTxResponse.message);
    }

    return rawTxResponse.hash;
  }

  /**
   * Transfer funds from the Main Fund Account to the customer's Account.
   *
   * @param {string} amount Amount to transfer in uPOKT denomination.
   * @param {string} customerAddress Recipient address.
   *
   * @returns {Promise<string>} The transaction hash.
   * @throws {PocketNetworkError}
   */
  async transferFromMainFund(amount, customerAddress) {
    const {transaction_fee: transactionFee, chain_id: chainID} = POCKET_NETWORK_CONFIGURATION;

    // Include transaction fee for the stake transaction
    const totalAmount = bigInt(amount).add(bigInt(transactionFee));
    const pocketRpcProvider = await getRPCProvider();

    this.__pocket.rpc(pocketRpcProvider);

    console.log("transferFromMainFund")
    console.log(POCKET_MAIN_FUND_ACCOUNT)

    const objectTx = await this.__pocket.withPrivateKey(POCKET_MAIN_FUND_ACCOUNT)

    console.log(objectTx)

    const rawTxResponse = objectTx.send(POCKET_MAIN_FUND_ADDRESS, customerAddress, totalAmount.toString())
      .submit(chainID, transactionFee);

    if (typeGuard(rawTxResponse, RpcError)) {
      throw new PocketNetworkError(rawTxResponse.message);
    }

    return rawTxResponse.hash;
  }

  /**
   * Create an unlock account.
   *
   * @returns {Promise<UnlockedAccount>} The unlock account.
   * @throws {PocketNetworkError}
   */
  async createUnlockedAccount() {
    // TODO: produce a random passphrase
    const account = await this.__pocket.keybase.createAccount("test");
    const unlockedAccountOrError = await this.__pocket.keybase.getUnlockedAccount(account.addressHex, "test");

    if (typeGuard(unlockedAccountOrError, Error)) {
      throw new PocketNetworkError(unlockedAccountOrError.message);
    } else if (typeGuard(unlockedAccountOrError, UnlockedAccount)) {
      return unlockedAccountOrError;
    } else {
      throw new PocketNetworkError("Unknown error while unlocking account");
    }
  }
}
