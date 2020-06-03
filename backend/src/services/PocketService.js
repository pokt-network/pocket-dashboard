import {
  Account,
  Application,
  ApplicationParams,
  CoinDenom,
  Configuration,
  Node,
  NodeParams,
  Pocket,
  PocketAAT,
  RawTxResponse,
  StakingStatus,
  Transaction,
  PocketRpcProvider,
  publicKeyFromPrivate
} from "@pokt-network/pocket-js";
import {Configurations} from "../_configuration";
import bigInt from "big-integer";

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
  const dispatchersStr = POCKET_NETWORK_CONFIGURATION.dispatchers ? "" : POCKET_NETWORK_CONFIGURATION.dispatchers
  if (dispatchersStr === "") {
    return []
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
   * @returns {PocketRpcProvider} Pocket RPC Provider
   */
  async getPocketRPCProvider() {
    if (!this.pocketRpcProvider) {
      // Create the provider Pocket instance
      const pocket = new Pocket(getPocketDispatchers());

      // Create the AAT
      const appPrivKey = POCKET_NETWORK_CONFIGURATION.dashboard_aat.app_priv_key;
      const appPubKey = publicKeyFromPrivate(Buffer.from(appPrivKey, "hex")).toString("hex");
      const clientPrivKey = POCKET_NETWORK_CONFIGURATION.dashboard_aat.client_priv_key;
      const clientPubKey = publicKeyFromPrivate(Buffer.from(clientPrivKey, "hex")).toString("hex");

      const dashboardAAT = await PocketAAT.from("0.0.1", clientPubKey, appPubKey, appPrivKey);

      // Import and unlock client account
      const clientAccount = await pocket.keybase.importAccount(Buffer.from(clientPrivKey, "hex"), POCKET_NETWORK_CONFIGURATION.dashboard_aat.client_priv_key_passphrase);

      await pocket.keybase.unlockAccount(clientAccount.addressHex, POCKET_NETWORK_CONFIGURATION.dashboard_aat.client_priv_key_passphrase, 0);

      this.pocketRpcProvider = new PocketRpcProvider(pocket, dashboardAAT, POCKET_NETWORK_CONFIGURATION.chain_hash);
    }
    return this.pocketRpcProvider;
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
   * Retrieve account from network.
   *
   * @param {string} addressHex Address of account to retrieve in hex.
   *
   * @returns {Promise<Account | Error>} A pocket account.
   */
  async getAccount(addressHex) {
    return this.__pocket.keybase.getAccount(addressHex);
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
   * Export Private key of the account.
   *
   * @param {string} addressHex Address of account to export in hex.
   * @param {string} passphrase Passphrase used to generate the account.
   *
   * @returns {Promise<Buffer | Error>} A buffer of private key.
   */
  async exportAccount(addressHex, passphrase) {
    return this.__pocket.keybase.exportAccount(addressHex, passphrase);
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
    const pocketRpcProvider = await this.getPocketRPCProvider();
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
    const pocketRpcProvider = await this.getPocketRPCProvider();
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
   * @throws Error If Query fails.
   * @async
   */
  async getApplication(addressHex, throwError = true) {
    const pocketRpcProvider = await this.getPocketRPCProvider();
    const applicationResponse = await this.__pocket.rpc(pocketRpcProvider).query.getApp(addressHex);

    if (applicationResponse instanceof Error) {
      if (throwError) {
        throw applicationResponse;
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
   * @throws Error If Query fails.
   * @async
   */
  async getNode(addressHex) {
    const pocketRpcProvider = await this.getPocketRPCProvider();
    const nodeResponse = await this.__pocket.rpc(pocketRpcProvider).query.getNode(addressHex);

    if (nodeResponse instanceof Error) {
      throw nodeResponse;
    }

    return nodeResponse.node;
  }

  /**
   * Get Applications data.
   *
   * @param {StakingStatus} status Status of the apps to retrieve.
   *
   * @returns {Promise<Application[]>} The applications data.
   * @throws Error If Query fails.
   * @async
   */
  async getApplications(status) {
    const pocketRpcProvider = await this.getPocketRPCProvider();
    const applicationsResponse = await this.__pocket.rpc(pocketRpcProvider).query.getApps(status);

    if (applicationsResponse instanceof Error) {
      throw applicationsResponse;
    }

    return applicationsResponse.applications;
  }

  /**
   * Get Application Parameters data.
   *
   * @returns {Promise<ApplicationParams>} The application parameters.
   * @throws Error If Query fails.
   * @async
   */
  async getApplicationParameters() {
    const pocketRpcProvider = await this.getPocketRPCProvider();
    const applicationParametersResponse = await this.__pocket.rpc(pocketRpcProvider).query.getAppParams();

    if (applicationParametersResponse instanceof Error) {
      throw applicationParametersResponse;
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
   *
   * @param {string[]} networkChains Network Chains to stake.
   * @param {URL} serviceURL Service URL.
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
   * @throws Error If Query fails.
   * @async
   */
  async getNodeParameters() {
    const pocketRpcProvider = await this.getPocketRPCProvider();
    const nodeParametersResponse = await this.__pocket.rpc(pocketRpcProvider).query.getNodeParams();

    if (nodeParametersResponse instanceof Error) {
      throw nodeParametersResponse;
    }

    return nodeParametersResponse.nodeParams;
  }

  /**
   * Creates a new PPK Object: https://github.com/pokt-network/pocket-core/blob/staging/doc/portable-private-key-spec.md
   *
   * @param {string} privateKey Private key of the account
   * @param {string} passphrase Passphrase to encrypt the PPK with
   */
  async createPPK(privateKey, passphrase) {
    const ppkData = await this.__pocket.keybase.exportPPK(privateKey, passphrase);

    if (ppkData instanceof Error) {
      throw ppkData;
    }

    return JSON.parse(ppkData);
  }
}
