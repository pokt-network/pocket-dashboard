import {before, describe, it} from "mocha";
import "chai/register-should";
import {Configurations} from "../../src/_configuration";
import {PaymentCurrencies, PaymentTypes} from "../../src/providers/payment/BasePaymentProvider";
import PaymentService from "../../src/services/PaymentService";
import {configureTestService} from "../setupTests";
import {PaymentHistory, PaymentMethod} from "../../src/models/Payment";

const paymentService = new PaymentService();

before(() => {
  configureTestService(paymentService);
});

describe("PaymentService", () => {

  describe("getAvailableCurrencies", () => {
    it("List of available currencies", () => {

      const currencies = paymentService.getAvailableCurrencies();

      // eslint-disable-next-line no-undef
      should.exist(currencies);

      currencies.should.be.an("array");
    });
  });

  describe("savePaymentMethod", () => {
    it("Save a payment method without error", async () => {

      const paymentMethodData = {
        user: "tester@testing.com",
        id: "paymentMethodTestID",
        billingDetails: {
          name: "Tester",
          address: {
            line1: "Test billing detail",
            postal_code: "Test postal code",
            country: "TE"
          }
        }
      };

      const saved = await paymentService.savePaymentMethod(paymentMethodData);

      // eslint-disable-next-line no-undef
      should.exist(saved);

      saved.should.be.equal(true);
    });
  });

  describe("paymentMethodExists", () => {
    it("Expect a true value", async () => {

      const paymentMethodData = {
        user: "tester@testing.com",
        id: "paymentMethodTestID",
        billingDetails: {
          name: "Tester",
          address: {
            line1: "Test billing detail",
            postal_code: "Test postal code",
            country: "TE"
          }
        }
      };

      const paymentMethod = PaymentMethod.createPaymentMethod(paymentMethodData);
      const exists = await paymentService.paymentMethodExists(paymentMethod);

      exists.should.be.equal(true);
    });
  });

  describe("savePaymentHistory", () => {
    it("Save a payment history without error", async () => {

      const user = "tester@testing.com";
      const createdDate = "Now";
      const paymentID = "paymentMethodTestID";
      const currency = "usd";
      const amount = 1000;
      const item = {
        "account": "b9628a13220f049b93fdefe4fb9ca2bca10fe460",
        "name": "My App",
        "pokt": 346
      };

      const saved = await paymentService.savePaymentHistory(createdDate, paymentID, currency, amount, item, user);

      // eslint-disable-next-line no-undef
      should.exist(saved);

      saved.should.be.equal(true);
    });
  });

  describe("paymentHistoryExists", () => {
    it("Expect a true value", async () => {

      const paymentHistoryData = {
        user: "tester@testing.com",
        createdDate: "Now",
        paymentID: "paymentMethodTestID",
        currency: "usd",
        amount: 1000,
        item: {
          "account": "b9628a13220f049b93fdefe4fb9ca2bca10fe460",
          "name": "My App",
          "pokt": 346
        }
      };

      const paymentHistory = PaymentHistory.createPaymentHistory(paymentHistoryData);
      const exists = await paymentService.paymentHistoryExists(paymentHistory);

      exists.should.be.equal(true);
    });
  });

  describe("markPaymentAsSuccess", () => {
    it("Expect a true value", async () => {

      const paymentHistoryData = {
        user: "tester@testing.com",
        paymentID: "paymentMethodTestID",
        paymentMethodID: "paymentMethodTestID",
        billingDetails: {
          name: "Tester",
          address: {
            line1: "Test billing detail",
            postal_code: "Test postal code",
            country: "TE"
          }
        }
      };

      const exists = await paymentService.markPaymentAsSuccess(paymentHistoryData);

      exists.should.be.equal(true);
    });
  });

  if (Configurations.payment.test.client_id && Configurations.payment.test.client_secret) {
    describe("createPaymentIntent for apps that don’t require authentication", () => {
      it.skip("Create a Payment with amount, currency and type successfully", async () => {
        const type = PaymentTypes.card;
        const currency = PaymentCurrencies.usd;
        const item = {
          account: "b9628a13220f049b93fdefe4fb9ca2bca10fe460",
          name: "My App",
          pokt: 346
        };
        const amount = 90;

        const paymentResult = await paymentService.createPocketPaymentIntentForApps(type, currency, item, amount);

        // eslint-disable-next-line no-undef
        should.exist(paymentResult);

        paymentResult.should.be.an("object");
        paymentResult.paymentNumber.should.be.a("string");
      });
    });
  }
});
