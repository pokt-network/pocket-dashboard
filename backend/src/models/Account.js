import {Account} from "@pokt-network/pocket-js";
import PocketService from "../services/PocketService";

export class PublicPocketAccount {

  /**
   * @param {string} address Address in Hex.
   * @param {string} publicKey Public key in Hex.
   */
  constructor(address, publicKey) {
    Object.assign(this, {address, publicKey});
  }

  /**
   * Convenient Factory method to create a application public pocket account.
   *
   * @param {Account} account Pocket account.
   *
   * @returns {PublicPocketAccount} A new application public pocket account.
   * @static
   */
  static createPublicPocketAccount(account) {
    const publicKey = account.publicKey.toString("hex");

    return new PublicPocketAccount(account.addressHex, publicKey);
  }
}

export class PrivatePocketAccount {

  /**
   * @param {string} address Address in Hex.
   * @param {string} privateKey Unencrypted private key in Hex.
   */
  constructor(address, privateKey) {
    Object.assign(this, {address, privateKey});
  }

  /**
   * Convenient Factory method to create a application private pocket account.
   *
   * @param {PocketService} pocketService Pocket service used to get account.
   * @param {Account} account Pocket account.
   * @param {string} passPhrase Passphrase used to generate account.
   *
   * @returns {Promise<PrivatePocketAccount>} A new application private pocket account.
   * @static
   * @async
   */
  static async createPrivatePocketAccount(pocketService, account, passPhrase) {
    const privateKey = await pocketService.exportRawAccount(account.addressHex, passPhrase);

    return new PrivatePocketAccount(account.addressHex, privateKey);
  }
}
