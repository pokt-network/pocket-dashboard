import {describe, it} from "mocha";
import {assert} from "chai";
import CheckoutService from "../../src/services/CheckoutService";

const POKT_MARKET_PRICE = 0.06;
const CHECKOUT_OPTIONS = {
  default_currency: "USD",
  relays_per_day: {
    min: 1,
    max: 6912,
    base_relay_per_pokt: 0.12
  },
  stability: 0,
  sessions_per_day: 3456,
  p_rate: 0.1
};

const checkoutService = CheckoutService.getInstance(CHECKOUT_OPTIONS, POKT_MARKET_PRICE);

describe("CheckoutService", () => {

  describe("getRelaysPerDay", () => {
    it("Expect a json data of relays per day", () => {
      const relaysPerDay = checkoutService.getRelaysPerDay();

      assert.isObject(relaysPerDay);

      assert.isNumber(relaysPerDay.min);
      assert.isNumber(relaysPerDay.max);
    });
  });

  describe("getMoneyToSpent", () => {
    it("Expect an integer value greater than 0.", () => {
      const relaysPerDay = 4000;

      const cost = checkoutService.getMoneyToSpent(relaysPerDay);

      assert.isNumber(cost);
      assert.isAbove(cost, 0);
      assert.equal(cost, 5.787037037037037);
    });
  });
});