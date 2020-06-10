import {PublicPocketAccount} from "../models/Account";
import {Account, CoinDenom} from "@pokt-network/pocket-js";
import PocketService, {POKT_DENOMINATIONS} from "./PocketService";
import {Configurations} from "../_configuration";
import BasePocketService from "./BasePocketService";


export default class AccountService extends BasePocketService {

  /**
   * Import account into network.
   *
   * @param {PocketService} pocketService Pocket service used to import account.
   * @param {string} privateKey Private key used to import pocket account.
   * @param {string} passphrase Passphrase used to import pocket account.
   *
   * @returns {Promise<Account>} a pocket account.
   * @throws Error If account is invalid.
   * @deprecated This method will be deleted soon.
   * @async
   */
  async importAccountToNetwork(pocketService, privateKey, passphrase) {
    const account = await pocketService.importAccount(privateKey, passphrase);

    if (account instanceof Error) {
      throw TypeError("Account is invalid");
    }

    return account;
  }

  /**
   * Import account into network.
   *
   * @param {string} privateKey Account private key.
   * @param {string} passphrase Passphrase of account.
   *
   * @returns {Promise<PublicPocketAccount>} a pocket account.
   * @throws Error If account is invalid.
   * @deprecated This method will be deleted soon.
   * @async
   */
  async importDashboardAccountToNetwork(privateKey, passphrase) {
    const applicationAccount = await this.pocketService.importAccount(privateKey, passphrase);

    if (applicationAccount instanceof Error) {
      throw TypeError("Account is invalid");
    }

    return PublicPocketAccount.createPublicPocketAccount(applicationAccount);
  }

  /**
   * Import account into network.
   *
   * @param {object} ppkData Account private key.
   * @param {string} passphrase Passphrase of account.
   *
   * @returns {Promise<PublicPocketAccount>} a pocket account.
   * @throws Error If account is invalid.
   * @async
   */
  async importDashboardAccountToNetworkFromPPK(ppkData, passphrase) {
    const applicationAccount = await this.pocketService.importAccountFromPPK(ppkData, passphrase);

    if (applicationAccount instanceof Error) {
      throw TypeError("Account is invalid");
    }

    return PublicPocketAccount.createPublicPocketAccount(applicationAccount);
  }

  /**
   * Get POKT balance of account
   *
   * @param {string} accountAddress Account address to get balance.
   *
   * @returns {Promise<number>} Account balance.
   * @async
   */
  async getPoktBalance(accountAddress) {
    const balance = await this.pocketService.getBalance(accountAddress);

    return parseInt(balance);
  }

  /**
   * Get balance of account
   *
   * @param {string} accountAddress Account address to get balance.
   * @param {CoinDenom} pocketDenomination Pocket denomination.
   *
   * @returns {Promise<number>} Account balance.
   * @async
   */
  async getBalance(accountAddress, pocketDenomination = CoinDenom.Upokt) {
    const {pokt_market_price: poktMarketPrice} = Configurations.pocket_network;
    const pokt = await this.getPoktBalance(accountAddress);

    return (pokt / Math.pow(10, POKT_DENOMINATIONS[pocketDenomination])) * poktMarketPrice;
  }
}
