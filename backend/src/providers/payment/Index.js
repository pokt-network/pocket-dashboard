import StripePaymentProvider from "./StripePaymentProvider";

/** @type {BasePaymentProvider} */
const DEFAULT_PAYMENT_PROVIDER = new StripePaymentProvider();

export function get_default_payment_provider() {
  return DEFAULT_PAYMENT_PROVIDER;
}
