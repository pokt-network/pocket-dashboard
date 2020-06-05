/* eslint-disable function-call-argument-newline */
import {Configurations} from "../../_configuration";
const pocketJS = require("@pokt-network/pocket-js/dist/web.js");

const {Configuration, Pocket} = pocketJS;

const POCKET_NETWORK_CONFIGURATION = Configurations.pocket_network;

const POCKET_CONFIGURATION = new Configuration(
  POCKET_NETWORK_CONFIGURATION.max_dispatchers,
  POCKET_NETWORK_CONFIGURATION.max_sessions,
  0,
  POCKET_NETWORK_CONFIGURATION.request_timeout
);

/**
 * Retrieve a list of URL's from the configuration for the dispatchers
 * (Taken from the backend)
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
    this._pocket = new Pocket(
      getPocketDispatchers(),
      undefined,
      POCKET_CONFIGURATION
    );
  }

  /**
   * @description Creates an account, unlocks it and stores it in the keybase
   * @param {string} passphrase The passphrase for the account in this keybase
   * @returns {Promise<Account | Error>} The the new account or an Error
   */
  async createAndUnlockAccount(passphrase) {
    const account = await this._pocket.keybase.createAccount(passphrase);
    const unlockedAccount = await this._pocket.keybase.unlockAccount(
      account.addressHex,
      passphrase,
      0
    );

    return unlockedAccount === undefined ? account : unlockedAccount;
  }

  /**
   * @description Unlock an account for passphrase free signing of arbitrary payloads.
   * @param {string} address The address of the account that will be unlocked in hex string format
   * @param {string} passphrase The passphrase of the account to unlock
   * @returns {Promise<Error | undefined>} Undefined if account got unlocked or an Error
   */
  async unlockAccount(address, passphrase) {
    return await this._pocket.keybase.unlockAccount(
      address,
      passphrase,
      // Maintan the pocket account on the cache of the library for later use
      0
    );
  }

  /**
   * @description Creates a Portable Private Key(PPK) using an Account
   * @param {Account} account - Account object.
   * @param {string} passphrase - Passphrase to store the account in the keybase.
   * @returns {Promise<string | Error>} - PPK string or error
   */
  async createPPKfromAccount(account, passphrase) {
    return await this._pocket.keybase.exportPPKfromAccount(
      account,
      passphrase,
      undefined,
      passphrase
    );
  }

  /**
   * @description Creates a Portable Private Key(PPK) from an account private key
   * @param {string} privateKey - Account raw private key.
   * @param {string} password - Desired password for the PPK.
   * @param {string} hint - (Optional) Private key hint.
   * @returns {Promise<string | Error>} - PPK string or error
   */
  async createPPKfromPrivateKey(privateKey, passphrase) {
    return await this._pocket.keybase.exportPPK(privateKey, passphrase);
  }

  // TODO: Implement
  async makeTransaction(ppkData, passphrase) {}

  /**
   * @description Retrieves an unlocked account from the keybase
   * @param {string} address - The address of the account to retrieve in hex string format
   * @returns {Promise<Account | Error>} - The account or an Error
   */
  async getUnlockedAccount(address) {
    return await this._pocket.keybase.getAccount(address);
  }

  /**
   * Deletes an account stored in the keybase.
   * @param {*} address - Address of the account in hex string format
   * @param {*} passphrase - Passphrase of the account
   * @returns {Promise<Error | undefined>} undefined if the account was deleted or an Error
   */
  async deleteAccount(address, passphrase) {
    return await this._pocket.keybase.deleteAccount(address, passphrase);
  }

  /**
   * @description Imports an a PPK (pocket's Portable Private key format)
   * and stores it in the keybase
   * @param {string} ppk - Non-parsed ppk
   * @param {*} passphrase - account passphrase
   * @returns {Promise<Account | Error>}
   */
  async saveAccount(ppk, passphrase) {
    return await this._pocket.keybase.importPPKFromJSON(
      passphrase,
      ppk,
      passphrase
    );
  }
}

export default new PocketClientService();
