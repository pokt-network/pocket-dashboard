import BaseService from "./BaseService";
import {Account, CoinDenom} from "@pokt-network/pocket-js";


export default class CheckoutService extends BaseService {

  __pocketDenominations = {
    pokt: 0,
    upokt: 6
  };

  /**
   * @param {object} options Options used in checkout service.
   * @param {string} options.default_currency Default currency.
   * @param {number} options.pokt_market_price Market price of POKT.
   * @param {object} options.relays_per_day Relays per day data.
   * @param {number} options.relays_per_day.min Min of Relays per day.
   * @param {number} options.relays_per_day.max Max of Relays per day.
   * @param {number} options.relays_per_day.base_relay_per_pokt Base Relays per POKT
   * @param {number} options.stability Stability
   * @param {number} options.sessions_per_day Sessions per day.
   * @param {number} options.p_rate P rate.
   */
  constructor(options) {
    super();

    this.options = options;
  }

  /**
   *  Get relays per day data.
   *
   *  @returns {{min:number, max: number, }} Relays per day data.
   */
  getRelaysPerDay() {
    return {
      min: this.options.relays_per_day.min,
      max: this.options.relays_per_day.max
    };
  }

  /**
   * Get Pokt to Stake.
   *
   * @param {number} moneySpent Money to spent.
   *
   * @returns {number} Pokt to use.
   */
  getPoktToStake(moneySpent) {
    const marketPrice = this.options.pokt_market_price;

    return moneySpent / marketPrice;
  }

  /**
   * Get base throughtput.
   *
   * @param {bigint} stakedPokt Pokt staked.
   *
   * @returns {bigint} Base throughtput.
   */
  getBaseThroughtput(stakedPokt) {
    const baseRelayPerPOKT = this.options.relays_per_day.base_relay_per_pokt;

    return stakedPokt * baseRelayPerPOKT;
  }

  /**
   * Get max relays session.
   *
   * @param {bigint} baseThroughtput Base throughtput.
   *
   * @returns {number} Max Relays Session.
   */
  getMaxRelaysSession(baseThroughtput) {
    const pRate = this.options.p_rate;
    const stability = this.options.stability;

    return (baseThroughtput * pRate) + stability;
  }

  /**
   * Get Max Relays per days.
   *
   * @param {number} maxRelaySession Max relay session.
   *
   * @returns {number} Max Relays Per Day.
   */
  getMaxRelaysPerDay(maxRelaySession) {
    const sessionsInADay = this.options.sessions_per_day;

    return maxRelaySession * sessionsInADay;
  }

  /**
   * Get balance of account
   *
   * @param {Account} account Account to get balance.
   * @param {CoinDenom} pocketDenomination Pocket denomination.
   *
   * @returns {Promise<number>} Account balance.
   * @async
   */
  async getAccountBalance(account, pocketDenomination = CoinDenom.Pokt) {
    const poktMarketPrice = this.options.pokt_market_price;
    const balance = await this.pocketService.getBalance(account);
    const pokt = parseInt(balance) / Math.pow(10, this.__pocketDenominations[pocketDenomination]);

    return pokt * poktMarketPrice;
  }

  getRelaysPerDayCost() {
    return this.options.pokt_market_price;
  }

  getMoneyToSpent(relaysPerDay) {

  }


}
