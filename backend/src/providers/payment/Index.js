import StripePaymentProvider from "./StripePaymentProvider";
import {Configurations} from "../../_configuration";

/** @type {BasePaymentProvider} */
const DEFAULT_PAYMENT_PROVIDER = new StripePaymentProvider(Configurations.payment.default);

export function get_default_payment_provider() {
  return DEFAULT_PAYMENT_PROVIDER;
}
