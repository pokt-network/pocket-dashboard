import express from "express";
import ApplicationCheckoutService from "../services/checkout/ApplicationCheckoutService";
import {getQueryOption} from "./_helpers";
import NodeCheckoutService from "../services/checkout/NodeCheckoutService";

const router = express.Router();

const applicationCheckoutService = ApplicationCheckoutService.getInstance();
const nodeCheckoutService = NodeCheckoutService.getInstance();

router.get("/applications/relays-per-day", (request, response) => {
  try {
    const relaysPerDay = applicationCheckoutService.getRelaysPerDay();

    response.send(relaysPerDay);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

router.get("/nodes/validator-power", (request, response) => {
  try {
    const validatorPower = nodeCheckoutService.getValidatorPowerData();

    response.send(validatorPower);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

router.get("/applications/cost", (request, response) => {
  try {
    const relaysPerDay = parseInt(getQueryOption(request, "rpd"));

    const cost = applicationCheckoutService.getMoneyToSpent(relaysPerDay);

    response.send({cost});
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

router.get("/nodes/cost", (request, response) => {
  try {
    const validatorPower = parseInt(getQueryOption(request, "vp"));

    const cost = nodeCheckoutService.getMoneyToSpent(validatorPower);

    response.send({cost});
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});


export default router;
