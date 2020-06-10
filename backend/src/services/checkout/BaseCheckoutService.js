import {POKT_DENOMINATIONS} from "../PocketService";
import BaseService from "../BaseService";
import {CoinDenom} from "@pokt-network/pocket-js";
import {DashboardValidationError} from "../../models/Exceptions";

/**
 *  @abstract
 */
export class BaseCheckoutService extends BaseService {


  /**
   * @param {object} options Options used in checkout service.
   * @param {string} options.default_currency Default currency.
   * @param {object} options.relays_per_day Relays per day data.
   * @param {number} options.relays_per_day.min Min of Relays per day.
   * @param {number} options.relays_per_day.max Max of Relays per day.
   * @param {object} options.validator_power Validator power data.
   * @param {number} options.validator_power.min Min of Validator power.
   * @param {number} options.validator_power.max Max of Validator power.
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
   * Get money to spent.
   *
   * @param {number} value Relays per day.
   *
   * @returns {number} Money to spent.
   * @throws {DashboardValidationError} if value is out of allowed range.
   * @abstract
   */
  getMoneyToSpent(value) {
  }
}
