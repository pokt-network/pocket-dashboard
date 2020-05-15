import BaseService from "./BaseService";
import {PublicPocketAccount} from "../models/Account";
import {Account} from "@pokt-network/pocket-js";
import bcrypt from "bcrypt";
import PocketService from "./PocketService";

export default class AccountService extends BaseService {

  constructor() {
    super();
  }

  /**
   * Generate a random passphrase.
   *
   * @param {string} data Data.
   *
   * @returns {string} A passphrase.
   * @async
   */
  async generatePassphrase(data) {
    const seed = 10;

    const now = new Date();
    const dataToGenerate = `${data} + ${now.toUTCString()}`;

    return await bcrypt.hash(dataToGenerate, seed);
  }

  /**
   * Create a pocket account in the network.
   *
   * @param {PocketService} pocketService Pocket service used to get account.
   * @param {string} passPhrase Passphrase used to create pocket account.
   * @param {string} [privateKey] Private key used to import pocket account.
   *
   * @returns {Promise<Account> | Error} A Pocket account created successfully.
   * @throws {Error} If creation of account fails.
   */
  async createPocketAccount(pocketService, passPhrase, privateKey) {
    if (privateKey) {
      const importedAccount = await pocketService.importAccount(privateKey, passPhrase);

      if (importedAccount instanceof Error) {
        throw Error("Imported account is invalid");
      }

      return importedAccount;
    } else {
      // Generate Pocket account for item.
      const account = await pocketService.createAccount(passPhrase);

      if (account instanceof Error) {
        throw account;
      }

      return account;
    }
  }

  /**
   * Import account into network.
   *
   * @param {PocketService} pocketService Pocket service used to import account.
   * @param {string} passPhrase Passphrase used to import pocket account.
   * @param {string} privateKey Private key used to import pocket account.
   *
   * @returns {Promise<Account>} a pocket account.
   * @throws Error If account is invalid.
   * @async
   */
  async importAccountToNetwork(pocketService, passPhrase, privateKey) {
    const account = await pocketService.importAccount(privateKey, passPhrase);

    if (account instanceof Error) {
      throw TypeError("Account is invalid");
    }

    return account;
  }

  /**
   * Import account into network.
   *
   * @param {string} accountPrivateKey Account private key.
   *
   * @returns {Promise<PublicPocketAccount>} a pocket account.
   * @throws Error If account is invalid.
   * @async
   */
  async importDashboardAccountToNetwork(accountPrivateKey) {
    const passPhrase = "DashboardAccount";
    const applicationAccount = await this.pocketService.importAccount(accountPrivateKey, passPhrase);

    if (applicationAccount instanceof Error) {
      throw TypeError("Account is invalid");
    }

    return PublicPocketAccount.createPublicPocketAccount(applicationAccount);
  }
}
