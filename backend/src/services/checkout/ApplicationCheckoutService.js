import {BaseCheckoutService} from "./BaseCheckoutService";
import {Configurations} from "../../_configuration";

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
      throw new Error("Relays per day is out of allowed range.");
    }
    return (((((relaysPerDay / sessionsInADay) - stability) / pRate)) / baseRelayPerPOKT) * this.poktMarketPrice;
  }
}
