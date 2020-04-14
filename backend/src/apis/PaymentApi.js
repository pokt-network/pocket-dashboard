import express from "express";
import PaymentService from "../services/PaymentService";

const router = express.Router();

const paymentService = new PaymentService();

/**
 * Get all available currencies.
 */
router.get("/currencies", (request, response) => {
  try {

    const currencies = paymentService.getAvailableCurrencies();

    response.send(currencies);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Create a new intent of payment for apps.
 */
router.post("/new_intent/apps", async (request, response) => {
  try {
    /** @type {{type:string, currency: string, amount: number}} */
    const data = request.body;

    const paymentIntent = await paymentService.createPocketPaymentIntentForApps(data.type, data.currency, data.amount);

    response.send(paymentIntent);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Create a new intent of payment for nodes.
 */
router.post("/new_intent/nodes", async (request, response) => {
  response.send("// TODO: Implement this endpoint");
});

/**
 * Retrieve history information about payments.
 */
router.get("/history", (request, response) => {
  response.send("// TODO: Implement this endpoint");
});


export default router;
