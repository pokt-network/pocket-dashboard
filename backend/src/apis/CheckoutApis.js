import express from "express";
import ApplicationCheckoutService from "../services/ApplicationCheckoutService";
import {getQueryOption} from "./_helpers";

const router = express.Router();

const applicationCheckoutService = ApplicationCheckoutService.getInstance();

router.get("/relays-per-day", (request, response) => {
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

router.get("/cost", (request, response) => {
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


export default router;
