import {describe, it} from "mocha";
import "chai/register-should";
import {Configurations} from "../../src/_configuration";
import {PaymentCurrencies, PaymentTypes} from "../../src/providers/payment/BasePaymentProvider";
import PaymentService from "../../src/services/PaymentService";

const paymentService = new PaymentService();

describe("PaymentService", () => {

  describe("getAvailableCurrencies", () => {
    it("List of available currencies", () => {

      const currencies = paymentService.getAvailableCurrencies();

      // eslint-disable-next-line no-undef
      should.exist(currencies);

      currencies.should.be.an("array");
    });
  });

  if (Configurations.payment.test.client_id && Configurations.payment.test.client_secret) {
    describe("createPaymentIntent for apps that don’t require authentication", () => {
      it("Create a Payment with amount, currency and type successfully", async () => {
        const type = PaymentTypes.card;
        const currency = PaymentCurrencies.usd;
        const amount = 90;

        const paymentResult = await paymentService.createPocketPaymentIntentForApps(type, currency, amount);

        // eslint-disable-next-line no-undef
        should.exist(paymentResult);

        paymentResult.should.be.an("object");
        paymentResult.paymentNumber.should.be.a("string");
      });
    });
  }
});
