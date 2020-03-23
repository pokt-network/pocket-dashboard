import {after, before, describe, it} from "mocha";
import "chai/register-should";
import StripePaymentProvider, {StripeCardPaymentMethods} from "../../../src/providers/payment/StripePaymentProvider";
import {
  Card,
  CardBrands,
  PaymentCurrencies,
  PaymentMethodTypes
} from "../../../src/providers/payment/BasePaymentProvider";

/** @type {StripePaymentProvider} */
let stripePaymentProvider = null;

const TEST_CVC_NUMBER = 333;
const TEST_EXPIRATION_DATE = new Date(2025, 10, 1, 1, 33, 30, 0);

const TEST_CARDS = {
  no_auth_visa: new Card(StripeCardPaymentMethods.visa, CardBrands.visa, "4242424242424242", TEST_CVC_NUMBER, TEST_EXPIRATION_DATE),
  auth_card: new Card(StripeCardPaymentMethods.unknown, CardBrands.unknown, "4000002500003155", TEST_CVC_NUMBER, TEST_EXPIRATION_DATE),
  without_funds: new Card(StripeCardPaymentMethods.unknown, CardBrands.unknown, "4000000000009995", TEST_CVC_NUMBER, TEST_EXPIRATION_DATE),
};

before(() => {
  stripePaymentProvider = new StripePaymentProvider();
});


after(() => {
  stripePaymentProvider = null;
});

describe("StripePaymentProvider", () => {

  describe("makePayment that don’t require authentication", () => {
    it("Created a Payment with amount, currency, method type and description", async () => {
      const methodType = PaymentMethodTypes.card;
      const currency = PaymentCurrencies.usd;
      const amount = 90;
      const description = "Test payment with Pocket dashboard";

      /** @type {PaymentResult} */
      const paymentResult = await stripePaymentProvider.makePayment(methodType, currency, amount, description);

      // eslint-disable-next-line no-undef
      should.exist(paymentResult);

      paymentResult.should.be.an("object");
      paymentResult.paymentNumber.should.be.a("string");
    });

    it("Close a Payment with currency, payment method and Payment number", async () => {
      const paymentMethodType = PaymentMethodTypes.card;
      const currency = PaymentCurrencies.usd;

      /** @type {PaymentResult} */
      const paymentResult = await stripePaymentProvider.makePayment(paymentMethodType, currency, amount, description);

      // eslint-disable-next-line no-undef
      should.exist(paymentResult);

      paymentResult.should.be.an("object");
    });

  });
});
