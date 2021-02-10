import {describe, it} from "mocha";
import {assert} from "chai";
import ApplicationCheckoutService from "../../src/services/checkout/ApplicationCheckoutService";
import NodeCheckoutService from "../../src/services/checkout/NodeCheckoutService";

const POKT_MARKET_PRICE = 0.06;
const CHECKOUT_OPTIONS = {
  default_currency: "USD",
  relays_per_day: {
    min: 1,
    max: 6912,
    base_relay_per_pokt: 0.12
  },
  validator_power: {
    min: 1,
    max: 10
  },
  stability: 0,
  sessions_per_day: 3456,
  p_rate: 0.1
};

const applicationCheckoutService = ApplicationCheckoutService.getInstance(CHECKOUT_OPTIONS, POKT_MARKET_PRICE);
const nodeCheckoutService = NodeCheckoutService.getInstance(CHECKOUT_OPTIONS, POKT_MARKET_PRICE);

describe("ApplicationCheckoutService", () => {

  describe("getRelaysPerDay", () => {
    it("Expect a json data of relays per day", () => {
      const relaysPerDay = applicationCheckoutService.getRelaysPerDay();

      assert.isObject(relaysPerDay);

      assert.isNumber(relaysPerDay.min);
      assert.isNumber(relaysPerDay.max);
    });
  });

  describe("getMoneyToSpent", () => {
    it("Expect an integer value greater than 0.", () => {
      const relaysPerDay = 4000;

      const cost = applicationCheckoutService.getMoneyToSpent(relaysPerDay);

      assert.isNumber(cost);
      assert.isAbove(cost, 0);
      assert.equal(cost, 5.787037037037037);
    });
  });
});

describe("NodeCheckoutService", () => {

  describe("getValidatorPowerData", () => {
    it("Expect a json data of validator power", () => {
      const validatorPower = nodeCheckoutService.getValidatorPowerData();

      assert.isObject(validatorPower);

      assert.isNumber(validatorPower.min);
      assert.isNumber(validatorPower.max);
    });
  });

  describe("getMoneyToSpent", () => {
    it("Expect an integer value greater than 0.", () => {
      const validatorPower = 5;

      const cost = nodeCheckoutService.getMoneyToSpent(validatorPower);

      assert.isNumber(cost);
      assert.isAbove(cost, 0);
      assert.equal(cost, 0.3);
    });
  });
});
