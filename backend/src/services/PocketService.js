import {
  Account,
  Application,
  ApplicationParams,
  CoinDenom,
  Configuration,
  HttpRpcProvider,
  Node,
  NodeParams,
  Pocket,
  PocketAAT,
  RawTxResponse,
  StakingStatus,
  Transaction
} from "@pokt-network/pocket-js";
import {Configurations} from "../_configuration";
import bigInt from "big-integer";
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
   * Create account on Pokt network.
   *
   * @param {string} passphrase Passphrase used to generate account.
   *
   * @returns {Promise<Account | Error>} A pocket account.
   * @async
   */
  async createAccount(passphrase) {
    return this.__pocket.keybase.createAccount(passphrase);
  }

  /**
   * Import an account to Pokt network using private key of the account.
   *
   * @param {string} privateKeyHex Private key of the account to import in hex.
   * @param {string} passphrase Passphrase used to generate the account.
   *
   * @returns {Promise<Account | Error>} A pocket account.
   */
  async importAccount(privateKeyHex, passphrase) {
    return this.__pocket.keybase.importAccount(Buffer.from(privateKeyHex, "hex"), passphrase);
  }

  /**
   * Import an account to Pokt network using private key of the account.
   *
   * @param {object} ppkData Private key of the account to import in hex.
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
   * Retrieve the free tier account.
   *
   * @returns {Promise<{account:Account, passphrase:string} | Error>} Free Tier account.
   * @throws Error If the account is not valid.
   */
  async getFreeTierAccount() {
    const privateKey = POCKET_NETWORK_CONFIGURATION.free_tier.account;
    const passphrase = POCKET_NETWORK_CONFIGURATION.free_tier.passphrase;

    if (!privateKey) {
      throw Error("Free tier account value is required");
    }

    const account = await this.importAccount(privateKey, passphrase);

    if (account instanceof Error) {
      throw Error("Free tier account is not valid");
    }

    return {account, passphrase};
  }

  /**
   * Transfer Pokt between Accounts
   *
   * @param {Account} fromAccount From account address.
   * @param {string} passphrase passphrase of fromAccount.
   * @param {Account} toAccount To account address.
   * @param {string} uPoktAmount uPokt to transfer.
   *
   * @returns {Promise<RawTxResponse>} Raw Tx Response.
   * @async
   */
  async transferPoktBetweenAccounts(fromAccount, passphrase, toAccount, uPoktAmount) {
    const {chain_id, transaction_fee} = POCKET_NETWORK_CONFIGURATION;

    const transactionSender = await this.__pocket.withImportedAccount(fromAccount.addressHex, passphrase);

    const uPoktAmountWithFee = bigInt(uPoktAmount).add(bigInt(transaction_fee));

    const transactionResponse = await transactionSender
      .send(fromAccount.addressHex, toAccount.addressHex, uPoktAmountWithFee.toString())
      .submit(chain_id, transaction_fee);

    if (transactionResponse instanceof Error) {
      throw transactionResponse;
    }

    return transactionResponse;
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

        throw new PocketNetworkError(applicationResponse.toString());
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
      throw new PocketNetworkError(nodeResponse.toString());
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
    const chainID = POCKET_NETWORK_CONFIGURATION.chain_id;
    const applicationsResponse = await this.__pocket.rpc(pocketRpcProvider).query.getApps(status, 0, chainID);

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
    const chainID = POCKET_NETWORK_CONFIGURATION.chain_id;
    const nodesResponse = await this.__pocket.rpc(pocketRpcProvider).query.getNodes(status, 0, chainID);

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
      throw new PocketNetworkError(applicationParametersResponse.toString());
    }

    return applicationParametersResponse.applicationParams;
  }

  /**
   * Stake an application in pocket network.
   *
   * @param {Account} applicationAccount Application account to stake.
   * @param {string} passPhrase Passphrase used to import the account.
   * @param {string} uPoktAmount uPokt amount to stake.
   * @param {string[]} networkChains Network Chains to stake.
   *
   * @returns {Promise<RawTxResponse>} Raw transaction data
   * @throws Error if transaction fails.
   */
  async stakeApplication(applicationAccount, passPhrase, uPoktAmount, networkChains) {
    const {chain_id, transaction_fee} = POCKET_NETWORK_CONFIGURATION;
    const publicKey = applicationAccount.publicKey.toString("hex");

    const transactionSender = await this.__pocket.withImportedAccount(applicationAccount.addressHex, passPhrase);

    const transactionResponse = await transactionSender.appStake(publicKey, networkChains, uPoktAmount)
      .submit(chain_id, transaction_fee);

    if (transactionResponse instanceof Error) {
      throw transactionResponse;
    }

    return transactionResponse;
  }

  /**
   * Stake a node in pocket network.
   *
   * @param {Account} nodeAccount Node account to stake.
   * @param {string} passPhrase Passphrase used to import the account.
   * @param {string} uPoktAmount uPokt amount to stake.
   * @param {string[]} networkChains Network Chains to stake.
   * @param {URL} serviceURL Service URL.
   *
   * @returns {Promise<RawTxResponse>} Raw transaction data
   * @throws Error if transaction fails.
   */
  async stakeNode(nodeAccount, passPhrase, uPoktAmount, networkChains, serviceURL) {
    const {chain_id, transaction_fee} = POCKET_NETWORK_CONFIGURATION;
    const publicKey = nodeAccount.publicKey.toString("hex");

    const transactionSender = await this.__pocket.withImportedAccount(nodeAccount.address, passPhrase);

    const transactionResponse = await transactionSender.nodeStake(publicKey, networkChains, uPoktAmount, serviceURL)
      .submit(chain_id, transaction_fee, CoinDenom.Upokt, "Stake a node");

    if (transactionResponse instanceof Error) {
      throw transactionResponse;
    }

    return transactionResponse;
  }

  /**
   * Unstake an application in pocket network.
   *
   * @param {Account} applicationAccount Application account to unstake.
   * @param {string} passPhrase Passphrase used to import the account.
   *
   * @returns {Promise<RawTxResponse>} Raw transaction data
   * @throws Error if transaction fails.
   */
  async unstakeApplication(applicationAccount, passPhrase) {
    const {chain_id, transaction_fee} = POCKET_NETWORK_CONFIGURATION;
    const transactionSender = await this.__pocket.withImportedAccount(applicationAccount.addressHex, passPhrase);

    const transactionResponse = await transactionSender.appUnstake(applicationAccount.addressHex)
      .submit(chain_id, transaction_fee);

    if (transactionResponse instanceof Error) {
      throw transactionResponse;
    }

    return transactionResponse;
  }

  /**
   * Unstake a node in pocket network.
   *
   * @param {Account} nodeAccount Node account to unstake.
   * @param {string} passPhrase Passphrase used to import the account.
   *
   * @returns {Promise<RawTxResponse>} Raw transaction data
   * @throws Error if transaction fails.
   */
  async unstakeNode(nodeAccount, passPhrase) {
    const {chain_id, transaction_fee} = POCKET_NETWORK_CONFIGURATION;
    const transactionSender = await this.__pocket.withImportedAccount(nodeAccount.addressHex, passPhrase);

    const transactionResponse = await transactionSender.nodeUnstake(nodeAccount.addressHex)
      .submit(chain_id, transaction_fee);

    if (transactionResponse instanceof Error) {
      throw transactionResponse;
    }

    return transactionResponse;
  }

  /**
   * UnJail a node in pocket network.
   *
   * @param {Account} nodeAccount Node account to unJail.
   * @param {string} passPhrase Passphrase used to import the account.
   *
   * @returns {Promise<RawTxResponse>} Raw transaction data
   * @throws Error if transaction fails.
   */
  async unJailNode(nodeAccount, passPhrase) {
    const {chain_id, transaction_fee} = POCKET_NETWORK_CONFIGURATION;
    const transactionSender = await this.__pocket.withImportedAccount(nodeAccount.addressHex, passPhrase);

    const transactionResponse = await transactionSender.nodeUnjail(nodeAccount.addressHex)
      .submit(chain_id, transaction_fee);

    if (transactionResponse instanceof Error) {
      throw transactionResponse;
    }

    return transactionResponse;
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
      throw new PocketNetworkError(nodeParametersResponse.toString());
    }

    return nodeParametersResponse.nodeParams;
  }

  /**
   * Creates a new PPK Object: https://github.com/pokt-network/pocket-core/blob/staging/doc/portable-private-key-spec.md.
   *
   * @param {string} privateKey Private key of the account.
   * @param {string} passphrase Passphrase to encrypt the PPK with.
   *
   * @returns {*} PPK Data.
   * @throws {PocketNetworkError} If exportation of PPK fails.
   */
  async createPPK(privateKey, passphrase) {
    const ppkData = await this.__pocket.keybase.exportPPK(privateKey, passphrase);

    if (ppkData instanceof Error) {
      throw new PocketNetworkError(ppkData.toString());
    }

    return JSON.parse(ppkData);
  }
}
