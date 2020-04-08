import StripePaymentProvider from "./StripePaymentProvider";
import {Configurations} from "../../_configuration";
import BasePaymentProvider from "./BasePaymentProvider";

/** @type {BasePaymentProvider} */
const DEFAULT_PAYMENT_PROVIDER = new StripePaymentProvider(Configurations.payment.default);

/**
 * @returns {BasePaymentProvider} The default payment provider.
 */
export function get_default_payment_provider() {
  return DEFAULT_PAYMENT_PROVIDER;
}
