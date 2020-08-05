import {BaseCheckoutService} from "./BaseCheckoutService";
import {Configurations} from "../../_configuration";
import {DashboardValidationError} from "../../models/Exceptions";

/**
 * Check if a numeric option is valid
 *
 * @param {number|string} numericOption Numeric option value
 *
 * @returns {boolean} True or false.
 */
function isNumericOptionValid(numericOption) {
  return (numericOption === 0 || numericOption === "0" || numericOption === undefined || numericOption === null) === false;
}

/**
 * Check if a numeric option is negative
 *
 * @param {number|string} numericOption Numeric option value
 *
 * @returns {boolean} True or false.
 */
function isNumericOptionNegative(numericOption) {
  return Number(numericOption) < 0;
}

export default class ApplicationCheckoutService extends BaseCheckoutService {

  /**
   * Get instance of Application Checkout Service.
   *
   * @param {object} [options] Options used by service.
   * @param {number} [poktMarketPrice] POKT market price.
   *
   * @returns {ApplicationCheckoutService} An instance.
   */
  static getInstance(options = undefined, poktMarketPrice = undefined) {
    const serviceOptions = options ?? Configurations.pocket_network.checkout;
    const servicePoktMarketPrice = poktMarketPrice ?? Configurations.pocket_network.pokt_market_price;

    return new ApplicationCheckoutService(serviceOptions, servicePoktMarketPrice);
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
   * Get money to spent.
   *
   * @param {number} relaysPerDay Relays per day.
   *
   * @returns {number} Money to spent.
   * @throws {DashboardValidationError} if relays per day is out of allowed range.
   */
  getMoneyToSpent(relaysPerDay) {
    const {
      sessions_per_day: sessionsInADay,
      stability,
      relays_per_day: {
        min: minRelaysPerDay,
        max: maxRelaysPerDay,
        base_relay_per_pokt: baseRelayPerPOKT
      }
    } = this.options;
    
    let {
      p_rate: pRate
    } = this.options;

    if (relaysPerDay < minRelaysPerDay && relaysPerDay > maxRelaysPerDay) {
      throw new DashboardValidationError("Relays per day is out of allowed range.");
    }
    if (!isNumericOptionValid(baseRelayPerPOKT)) {
      throw new DashboardValidationError("Base relays per POKT can't never be 0, currently it's " + baseRelayPerPOKT);
    }
    if (!isNumericOptionValid(sessionsInADay)) {
      throw new DashboardValidationError("Session's in a day cannot be 0" + sessionsInADay);
    }
    if (!isNumericOptionValid(pRate)) {
      pRate = 1;
    }
    if (!isNumericOptionValid(this.poktMarketPrice) || isNumericOptionNegative(this.poktMarketPrice)) {
      throw new DashboardValidationError("Invalid POKT Market Price " + this.poktMarketPrice);
    }
    
    const result = (((((relaysPerDay / sessionsInADay) - stability) / pRate)) / baseRelayPerPOKT) * this.poktMarketPrice;

    return result.toFixed(2);
  }
}
