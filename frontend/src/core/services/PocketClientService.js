import {Configurations} from "../../_configuration";
import {Configuration, Pocket} from "@pokt-network/pocket-js/dist/web.js";

const POCKET_NETWORK_CONFIGURATION = Configurations.pocket_network;
const POCKET_CONFIGURATION = new Configuration(POCKET_NETWORK_CONFIGURATION.max_dispatchers, POCKET_NETWORK_CONFIGURATION.max_sessions, 0, POCKET_NETWORK_CONFIGURATION.request_timeout);

/**
 * Retrieve a list of URL's from the configuration for the dispatchers.
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

class PocketClientService {

  constructor() {
    this._pocket = new Pocket(getPocketDispatchers(), undefined, POCKET_CONFIGURATION);
  }

  /**
   * Creates a TransactionSenderObject to make operation requests over accounts.
   * Account must be previously saved on the keybase.
   *
   * @param {string} address - address of the account.
   * @param {string} passphrase - passphrase for the account.
   *
   * @returns {Object} Transaction sender.
   */
  async _getTransactionSender(address, passphrase) {
    const account = await this.getUnlockedAccount(address);

    if (account instanceof Error) {
      throw account;
    }

    return await this._pocket.withImportedAccount(account.address, passphrase);
  }

  /**
   * Creates an account, unlocks it and stores it in the key base.
   *
   * @param {string} passphrase The passphrase for the account in this key base.
   *
   * @returns {Promise<Account | Error>} The the new account or an Error
   */
  async createAndUnlockAccount(passphrase) {
    const account = await this._pocket.keybase.createAccount(passphrase);
    const unlockedAccount = await this._pocket.keybase.unlockAccount(account.addressHex, passphrase, 0);

    return unlockedAccount === undefined ? account : unlockedAccount;
  }

  /**
   * Unlock an account for passphrase free signing of arbitrary payloads.
   *
   * @param {string} address The address of the account that will be unlocked in hex string format.
   * @param {string} passphrase The passphrase of the account to unlock.
   *
   * @returns {Promise<Error | undefined>} Undefined if account got unlocked or an Error.
   */
  async unlockAccount(address, passphrase) {
    return await this._pocket.keybase.unlockAccount(address, passphrase, 0);
  }

  /**
   * Creates a Portable Private Key(PPK) using an Account.
   *
   * @param {Account} account - Account object.
   * @param {string} passphrase - Passphrase to store the account in the key base.
   *
   * @returns {Promise<string | Error>} - PPK string or error.
   */
  async createPPKFromAccount(account, passphrase) {
    return await this._pocket.keybase.exportPPKfromAccount(account, passphrase, undefined, passphrase);
  }

  /**
   * Exports an account's private key stored in the key base.
   *
   * @param {Account} account - Account object.
   * @param {string} passphrase - Passphrase to store the account in the key base.
   *
   * @returns {Promise<string | Error>} - PPK string or error.
   */
  async exportPrivateKey(account, passphrase) {
    /** @type {Buffer} */
    const privateKey = await this._pocket.keybase.exportAccount(account.addressHex, passphrase);

    return privateKey.toString("hex");
  }

  /**
   * Creates a Portable Private Key(PPK) from an account private key.
   *
   * @param {string} privateKey - Account raw private key.
   * @param {string} passphrase - Desired passphrase for the PPK.
   *
   * @returns {Promise<string | Error>} - PPK string or error.
   */
  async createPPKFromPrivateKey(privateKey, passphrase) {
    return await this._pocket.keybase.exportPPK(privateKey, passphrase);
  }

  /**
   * Retrieves an unlocked account from the key base.
   *
   * @param {string} address - The address of the account to retrieve in hex string format.
   *
   * @returns {Promise<Account | Error>} - The account or an Error.
   */
  async getUnlockedAccount(address) {
    return await this._pocket.keybase.getAccount(address);
  }

  /**
   * Imports an a PPK (pocket's Portable Private key format) and stores it in the key base.
   *
   * @param {string} ppk - Non-parsed ppk.
   * @param {*} passphrase - account passphrase.
   *
   * @returns {Promise<Account | Error>}
   */
  async saveAccount(ppk, passphrase) {
    return await this._pocket.keybase.importPPKFromJSON(passphrase, ppk, passphrase);
  }

  // TODO: On the stake methods, convert relays/validator-power to pokt.

  /**
   * Creates a transaction request to stake an application.
   * \
   * @param {string} address - Application address.
   * @param {string} passphrase - Application passphrase.
   * @param {string[]} chains - Network identifier list to be requested by this app.
   * @param {string} stakeAmount - the amount to stake, must be greater than 0.
   *
   * @returns {Promise<{address:string, txHex:string} | string>} - A transaction sender.
   */
  async appStakeRequest(address, passphrase, chains, stakeAmount) {
    try {
      const {chain_id: chainID, transaction_fee: transactionFee} = POCKET_NETWORK_CONFIGURATION;
      const transactionSender = await this._getTransactionSender(address, passphrase);
      const {unlockedAccount: account} = transactionSender;

      return await transactionSender
        .appStake(account.publicKey.toString("hex"), chains, stakeAmount)
        .createTransaction(chainID, transactionFee);

    } catch (e) {
      return e.toString();
    }
  }

  /**
   * Creates a transaction request to unstake an application.
   *
   * @param {string} address - Application address.
   * @param {string} passphrase - Application passphrase.
   *
   * @returns {Promise<{address:string, txHex:string}> | string} - A transaction sender.
   */
  async appUnstakeRequest(address, passphrase) {
    try {
      const {chain_id: chainID, transaction_fee: transactionFee} = POCKET_NETWORK_CONFIGURATION;
      const transactionSender = await this._getTransactionSender(address, passphrase);

      return await transactionSender
        .appUnstake(address)
        .createTransaction(chainID, transactionFee);

    } catch (e) {
      return e.toString();
    }
  }

  /**
   * Creates a transaction request to stake a node.
   *
   * @param {string} address - Node address.
   * @param {string} passphrase - Node passphrase.
   * @param {string[]} chains - Network identifier list to be requested by this node.
   * @param {string} stakeAmount - the amount to stake, must be greater than 0.
   * @param {string} serviceURL - Node service url.
   *
   * @returns {Promise<{address:string, txHex:string} | string>} - A transaction sender.
   */
  async nodeStakeRequest(address, passphrase, chains, stakeAmount, serviceURL) {
    try {
      const {chain_id: chainID, transaction_fee: transactionFee} = POCKET_NETWORK_CONFIGURATION;
      const transactionSender = await this._getTransactionSender(address, passphrase);
      const {unlockedAccount: account} = transactionSender;

      return await transactionSender
        .nodeStake(account.publicKey.toString("hex"), chains, stakeAmount, new URL(serviceURL))
        .createTransaction(chainID, transactionFee);

    } catch (e) {
      return e.toString();
    }
  }

  /**
   * Creates a transaction request to unstake a node.
   *
   * @param {string} address - Node address.
   * @param {string} passphrase - Node passphrase.
   *
   * @returns {Promise<{address:string, txHex:string}> | string} - A transaction sender.
   */
  async nodeUnstakeRequest(address, passphrase) {
    try {
      const {chain_id: chainID, transaction_fee: transactionFee} = POCKET_NETWORK_CONFIGURATION;
      const transactionSender = await this._getTransactionSender(address, passphrase);

      return await transactionSender
        .nodeUnstake(address)
        .createTransaction(chainID, transactionFee);

    } catch (e) {
      return e.toString();
    }
  }

  /**
   * Creates a transaction request to unjail a node.
   *
   * @param {string} address - Node address.
   * @param {string} passphrase - Node passphrase.
   *
   * @returns {Promise<{address:string, txHex:string}> | string} - A transaction sender.
   */
  async nodeUnjailRequest(address, passphrase) {
    try {
      const {chain_id: chainID, transaction_fee: transactionFee} = POCKET_NETWORK_CONFIGURATION;
      const transactionSender = await this._getTransactionSender(address, passphrase);

      return await transactionSender
        .nodeUnjail(address)
        .createTransaction(chainID, transactionFee);

    } catch (e) {
      return e.toString();
    }
  }
}

export default new PocketClientService();
