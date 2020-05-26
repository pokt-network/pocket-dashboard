import BaseService from "./BaseService";
import {Configurations} from "../_configuration";
import {CoinDenom} from "@pokt-network/pocket-js";
import {POKT_DENOMINATIONS} from "./PocketService";

export default class CheckoutService extends BaseService {

  /**
   * @param {object} options Options used in checkout service.
   * @param {string} options.default_currency Default currency.
   * @param {object} options.relays_per_day Relays per day data.
   * @param {number} options.relays_per_day.min Min of Relays per day.
   * @param {number} options.relays_per_day.max Max of Relays per day.
   * @param {number} options.relays_per_day.base_relay_per_pokt Base Relays per POKT
   * @param {number} options.stability Stability
   * @param {number} options.sessions_per_day Sessions per day.
   * @param {number} options.p_rate P rate.
   * @param {number} poktMarketPrice Pokt market price.
   */
  constructor(options, poktMarketPrice) {
    super();

    this.options = options;
    this.poktMarketPrice = poktMarketPrice;
  }

  /**
   * Get instance of CheckoutService.
   *
   * @param {object} [options] Options used by service.
   * @param {number} [poktMarketPrice] Pokt market price.
   *
   * @returns {CheckoutService} An instance.
   */
  static getInstance(options = undefined, poktMarketPrice = undefined) {
    const serviceOptions = options ?? Configurations.pocket_network.checkout;
    const servicePoktMarketPrice = poktMarketPrice ?? Configurations.pocket_network.pokt_market_price;

    return new CheckoutService(serviceOptions, servicePoktMarketPrice);
  }

  /**
   *  Get relays per day data.
   *
   *  @returns {{min:number, max: number}} Relays per day data.
   */
  getRelaysPerDay() {
    return {
      min: this.options.relays_per_day.min,
      max: this.options.relays_per_day.max,
    };
  }

  /**
   * Get Pokt to Stake.
   *
   * @param {number} moneySpent Money to spent.
   * @param {CoinDenom} poktDenomination Pokt denomination.
   *
   * @returns {number} Pokt to use.
   */
  getPoktToStake(moneySpent, poktDenomination = CoinDenom.Upokt) {
    const pokt = moneySpent / this.poktMarketPrice;
    const poktWithDenomination = pokt * Math.pow(10, POKT_DENOMINATIONS[poktDenomination]);

    return Math.round(poktWithDenomination);
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
    const {p_rate: pRate, stability} = this.options;

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
   * Get money to spent.
   *
   * @param {number} relaysPerDay Relays per day.
   *
   * @returns {number} Money to spent.
   * @throws {Error} if relays per day is out of allowed range.
   */
  getMoneyToSpent(relaysPerDay) {
    const {
      sessions_per_day: sessionsInADay,
      p_rate: pRate,
      stability,
      relays_per_day: {
        min: minRelaysPerDay,
        max: maxRelaysPerDay,
        base_relay_per_pokt: baseRelayPerPOKT
      }
    } = this.options;

    if (relaysPerDay < minRelaysPerDay && relaysPerDay > maxRelaysPerDay) {
      throw new Error("Relays per day out of allowed range.");
    }

    return (((((relaysPerDay / sessionsInADay) - stability) / pRate)) / baseRelayPerPOKT) * this.poktMarketPrice;
  }
}
