import {before, describe, it} from "mocha";
import "chai/register-should";
import StripePaymentProvider from "../../../src/providers/payment/StripePaymentProvider";
import {
  CardBrands,
  PaymentCard,
  PaymentCurrencies,
  PaymentTypes
} from "../../../src/providers/payment/BasePaymentProvider";
import {Configurations} from "../../../src/_configuration";

/** @type {StripePaymentProvider} */
let stripePaymentProvider = null;

const TEST_CVC_NUMBER = "333";
const TEST_EXPIRATION_DATE = new Date(2025, 10, 1, 1, 33, 30, 0);

const TEST_CARDS = {
  no_auth_visa: new PaymentCard(CardBrands.visa, "4242424242424242", TEST_CVC_NUMBER, TEST_EXPIRATION_DATE),
  auth_card: new PaymentCard(CardBrands.unknown, "4000002500003155", TEST_CVC_NUMBER, TEST_EXPIRATION_DATE),
  without_funds: new PaymentCard(CardBrands.unknown, "4000000000009995", TEST_CVC_NUMBER, TEST_EXPIRATION_DATE),
};

before(() => {
  stripePaymentProvider = new StripePaymentProvider(Configurations.payment.test);
});

if (Configurations.payment.test.client_id && Configurations.payment.test.client_secret) {

  describe("StripePaymentProvider", () => {

    describe("createCardPaymentMethod", () => {
      it("Created a card that don’t require authentication", async () => {

        const methodMethod = await stripePaymentProvider.createCardPaymentMethod(TEST_CARDS.no_auth_visa);

        // eslint-disable-next-line no-undef
        should.exist(methodMethod);

        methodMethod.should.be.an("object");
        methodMethod.object.should.be.equal("payment_method");
      });
    });

    describe("makeIntentPayment that don’t require authentication", () => {
      it("Created a Payment with amount, currency, type type and description", async () => {
        const currency = PaymentCurrencies.usd;
        const amount = 90;
        const description = "Test payment with Pocket dashboard";

        /** @type {PaymentResult} */
        const paymentResult = await stripePaymentProvider.makeIntentPayment(PaymentTypes.card, currency, amount, description);

        // eslint-disable-next-line no-undef
        should.exist(paymentResult);

        paymentResult.should.be.an("object");
        paymentResult.paymentNumber.should.be.a("string");
      });
    });
  });
}
