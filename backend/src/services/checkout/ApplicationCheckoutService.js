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
   * Get UPOKT and USD values for selected Relays per day.
   *
   * @param {number} relaysPerDay Relays per day.
   *
   * @returns {number} Money to spent.
   * @throws {DashboardValidationError} if relays per day is out of allowed range.
   */
  getCostForRelaysPerDay(relaysPerDay) {
    const {
      pokt_market_price: poktMarketPrice,
      max_usd_value: maxUsdValue,
      sessions_per_day: sessionsInADay,
      stability: SA,
      p_rate: PR,
      relays_per_day: {
        min: minRelaysPerDay,
        max: maxRelaysPerDay,
        base_relay_per_pokt: BP
      }
    } = this.options;

    const maxRPS = maxRelaysPerDay / sessionsInADay;
    const minRPS = minRelaysPerDay / sessionsInADay;
    const baseRelayPerPOKT = BP * 100;

    if (relaysPerDay < minRelaysPerDay && relaysPerDay > maxRelaysPerDay) {
      throw new DashboardValidationError("Relays per day is out of allowed range.");
    }

    if (poktMarketPrice <= 0) {
      throw new DashboardValidationError("Pokt market price is invalid.");
    }

    if (!isNumericOptionValid(baseRelayPerPOKT)) {
      throw new DashboardValidationError(`Base relays per POKT can't never be 0, currently it's ${baseRelayPerPOKT}`);
    }

    if (!isNumericOptionValid(sessionsInADay)) {
      throw new DashboardValidationError(`Session's in a day cannot be ${sessionsInADay}`);
    }

    if (!isNumericOptionValid(PR)) {
      throw new DashboardValidationError(`Participation Rate is invalid: ${PR}`);
    }

    if (!isNumericOptionValid(poktMarketPrice) || isNumericOptionNegative(poktMarketPrice)) {
      throw new DashboardValidationError(`Invalid POKT Market Price : ${poktMarketPrice}`);
    }

    const currRPS = relaysPerDay / sessionsInADay;

    const upokt = Number(((((currRPS - SA) / PR)) / BP).toFixed(6)) * 1000000;
    const pokt = upokt / 1000000;
    const usdValue = Number((pokt * poktMarketPrice).toFixed(2));

    if (usdValue > maxUsdValue) {
      throw new DashboardValidationError(`The USD value exceeds the maximum allowed: ${usdValue}>${maxUsdValue}`);
    }

    let expectedRPS = Math.trunc(((PR * (BP * (upokt/1000000))) + SA));

    if (currRPS !== expectedRPS) {
      const newUpokt = upokt + 1;
      const newPokt = newUpokt / 1000000;
      const newUsdValue = Number((newPokt * poktMarketPrice).toFixed(2));

      expectedRPS = Math.trunc(((PR * (BP * (newUpokt / 1000000))) + SA));

      if (currRPS !== expectedRPS) {
        throw new DashboardValidationError(`Current RPS (${currRPS}) != expected RPS (${expectedRPS})`);
      }
      return {upokt: newUpokt, usdValue: newUsdValue};
    }

    if (currRPS > maxRPS) {
      throw new DashboardValidationError(`Current RPS (${currRPS}) > max RPS (${maxRPS})`);
    }

    if (currRPS < minRPS) {
      throw new DashboardValidationError(`Current RPS (${currRPS}) < max RPS (${minRPS})`);
    }

    return {upokt, usdValue};
  }
}

