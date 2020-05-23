import express from "express";
import CheckoutService from "../services/CheckoutService";
import {getQueryOption} from "./_helpers";

const router = express.Router();

const checkoutService = CheckoutService.getInstance();

router.get("/relays-per-day", (request, response) => {
  try {
    const relaysPerDay = checkoutService.getRelaysPerDay();

    response.send(relaysPerDay);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

router.get("/balance/:accountAddress", async (request, response) => {
  try {

    /** @type {{accountAddress:string}} */
    const params = request.params;

    const balance = await checkoutService.getAccountBalance(params.accountAddress);

    response.send({balance});
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

    const cost = checkoutService.getMoneyToSpent(relaysPerDay);

    response.send({cost});
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});


export default router;
