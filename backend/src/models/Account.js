import {Account} from "@pokt-network/pocket-js";

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
   * @param {string} publicKey Public key in hex
   * @param {string} privateKey Unencrypted private key in Hex.
   */
  constructor(address, publicKey, privateKey) {
    Object.assign(this, {address, publicKey, privateKey});
  }
}
