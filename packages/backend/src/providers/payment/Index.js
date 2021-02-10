import StripePaymentProvider from "./StripePaymentProvider";
import TokenPaymentProvider from "./TokenPaymentProvider";
import { Configurations } from "../../_configuration";
import BasePaymentProvider from "./BasePaymentProvider";

/** @type {BasePaymentProvider} */
const DEFAULT_PAYMENT_PROVIDER = new StripePaymentProvider(
  Configurations.payment.default
);
/** @type {BasePaymentProvider} */
const TOKEN_PAYMENT_PROVIDER = new TokenPaymentProvider(
  Configurations.payment.default
);

/**
 * @returns {BasePaymentProvider} The default payment provider.
 */
export function get_default_payment_provider() {
  return DEFAULT_PAYMENT_PROVIDER;
}

/**
 * @returns {BasePaymentProvider} The token payment provider.
 */
export function getTokenPaymentProvider() {
  return TOKEN_PAYMENT_PROVIDER;
}

export const providerType = {
  stripe: "stripe",
  token: "token",
};
