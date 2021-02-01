import { BaseCheckoutService } from "./BaseCheckoutService";
import { Configurations } from "../../_configuration";
import { DashboardValidationError } from "../../models/Exceptions";

export default class NodeCheckoutService extends BaseCheckoutService {
  /**
   * Get instance of Node Checkout Service.
   *
   * @param {object} [options] Options used by service.
   * @param {number} [poktMarketPrice] POKT market price.
   *
   * @returns {NodeCheckoutService} An instance.
   */
  static getInstance(options = undefined, poktMarketPrice = undefined) {
    const serviceOptions = options ?? Configurations.pocket_network.checkout;
    const servicePoktMarketPrice =
      poktMarketPrice ?? Configurations.pocket_network.pokt_market_price;

    return new NodeCheckoutService(serviceOptions, servicePoktMarketPrice);
  }

  /**
   *  Get validator power data.
   *
   *  @returns {{min:number, max: number}} Validator power data.
   */
  getValidatorPowerData() {
    return {
      min: this.options.validator_power.min,
      max: this.options.validator_power.max,
    };
  }

  /**
   * Get money to spent.
   *
   * @param {number} validatorPower Validator power.
   *
   * @returns {number} Money to spent.
   * @throws {DashboardValidationError} if validator power is out of allowed range.
   */
  getMoneyToSpent(validatorPower) {
    const {
      validator_power: { min: minValidatorPower, max: maxValidatorPower },
    } = this.options;

    if (
      validatorPower < minValidatorPower &&
      validatorPower > maxValidatorPower
    ) {
      throw new DashboardValidationError(
        "Validator power is out of allowed range."
      );
    }

    const upokt = validatorPower * 1000000;

    const usdValue = validatorPower * this.poktMarketPrice;

    return { upokt, usdValue };
  }
}
