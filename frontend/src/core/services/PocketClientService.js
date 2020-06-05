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

  async createAndUnlockAccount(passphrase) {
    const account = await this._pocket.keybase.createAccount(passphrase);
    const unlockedAccount = await this._pocket.keybase.unlockAccount(
      account.addressHex,
      passphrase,
      0
    );

    return unlockedAccount === undefined ? account : unlockedAccount;
  }

  async unlockAccount(addressHex, passphrase) {
    return await this._pocket.keybase.unlockAccount(
      addressHex,
      passphrase,
      // Maintan the pocket account on the cache of the library for later use
      0
    );
  }

  async createPPKfromAccount(account, passphrase) {
    return await this._pocket.keybase.exportPPKfromAccount(
      account,
      passphrase,
      undefined,
      passphrase
    );
  }

  async createPPKfromPrivateKey(privateKey, passphrase) {
    return await this._pocket.keybase.exportPPK(privateKey, passphrase);
  }

  async importAccountFromPPK(pkkData, passphrase) {
    return await this._pocket.keybase.importPPKFromJSON(
      passphrase,
      JSON.stringify(pkkData),
      passphrase
    );
  }

  async makeTransaction(ppkData, passphrase) {}

  async getUnlockedAccount(address) {
    return await this._pocket.keybase.getAccount(address);
  }

  async deleteAccount(address, passphrase) {
    return await this._pocket.keybase.deleteAccount(address, passphrase);
  }

  async saveAccount(ppk, passphrase) {
    return await this._pocket.keybase.importPPKFromJSON(
      passphrase,
      ppk,
      passphrase
    );
  }
}

export default new PocketClientService();
