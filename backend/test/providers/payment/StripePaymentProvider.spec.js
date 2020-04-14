import {describe, it} from "mocha";
import "chai/register-should";
import StripePaymentProvider from "../../../src/providers/payment/StripePaymentProvider";
import {PaymentCurrencies, PaymentTypes} from "../../../src/providers/payment/BasePaymentProvider";
import {Configurations} from "../../../src/_configuration";

const stripePaymentProvider = new StripePaymentProvider(Configurations.payment.test);


describe("StripePaymentProvider", () => {

  if (Configurations.payment.test.client_id && Configurations.payment.test.client_secret) {
    describe("createPaymentIntent that don’t require authentication", () => {
      it("Created a Payment with amount, currency, type and description", async () => {
        const currency = PaymentCurrencies.usd;
        const amount = 90;
        const description = "Test payment with Pocket dashboard";

        const paymentResult = await stripePaymentProvider.createPaymentIntent(PaymentTypes.card, currency, amount, description);

        // eslint-disable-next-line no-undef
        should.exist(paymentResult);

        paymentResult.should.be.an("object");
        paymentResult.paymentNumber.should.be.a("string");
      });
    });
  }
});
