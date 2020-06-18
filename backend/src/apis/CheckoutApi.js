import express from "express";
import ApplicationCheckoutService from "../services/checkout/ApplicationCheckoutService";
import {apiAsyncWrapper, getQueryOption} from "./_helpers";
import NodeCheckoutService from "../services/checkout/NodeCheckoutService";

const router = express.Router();

const applicationCheckoutService = ApplicationCheckoutService.getInstance();
const nodeCheckoutService = NodeCheckoutService.getInstance();

router.get("/applications/relays-per-day", apiAsyncWrapper((req, res) => {
  const relaysPerDay = applicationCheckoutService.getRelaysPerDay();

  res.json(relaysPerDay);
}));

router.get("/nodes/validator-power", apiAsyncWrapper((req, res) => {
  const validatorPower = nodeCheckoutService.getValidatorPowerData();

  res.json(validatorPower);
}));

router.get("/applications/cost", apiAsyncWrapper((req, res) => {
  const relaysPerDay = parseInt(getQueryOption(req, "rpd"));
  const cost = applicationCheckoutService.getMoneyToSpent(relaysPerDay);
  res.json({cost});
}));

router.post("/applications/pokt", apiAsyncWrapper((req, res) => {
  /** @type {{money: number}} */
  const data = req.body;

  const cost = applicationCheckoutService.getPoktToStake(data.money);

  res.json({cost});
}));

router.get("/nodes/cost", apiAsyncWrapper((req, res) => {
  const validatorPower = parseInt(getQueryOption(req, "vp"));

  // Add transaction fee to cost
  const cost = nodeCheckoutService.getMoneyToSpent(validatorPower);
  res.json({cost});
}));

router.post("/nodes/pokt", apiAsyncWrapper((req, res) => {
  /** @type {{money: number}} */
  const data = req.body;

  const cost = nodeCheckoutService.getPoktToStake(data.money);

  res.json({cost});
}));


export default router;
