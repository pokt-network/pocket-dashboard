import BaseService from "./BaseService";
import {PublicPocketAccount} from "../models/Account";

export default class AccountService extends BaseService {

  constructor() {
    super();
  }

  /**
   * Import account.
   *
   * @param {string} accountPrivateKey Account private key.
   *
   * @returns {Promise<PublicPocketAccount>} a pocket account.
   * @throws Error If account is invalid.
   * @async
   */
  async importAccountFromNetwork(accountPrivateKey) {
    const passPhrase = "NetworkAccount";
    const applicationAccount = await this.pocketService.importAccount(accountPrivateKey, passPhrase);

    if (applicationAccount instanceof Error) {
      throw TypeError("Account is invalid");
    }

    return PublicPocketAccount.createPublicPocketAccount(applicationAccount);
  }
}
