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
 * Save a new payment method.
 */
router.post("/payment_method", async (request, response) => {
  // TODO: Implement this endpoint
  response.send("// TODO: Implement this endpoint");
});

/**
 * Create a new intent of payment for apps.
 */
router.post("/new_intent/apps", async (request, response) => {
  try {
    /** @type {{type:string, currency: string, item: {account:string, name:string, type:string, pokt:number}, amount: number}} */
    const data = request.body;

    const paymentIntent = await paymentService.createPocketPaymentIntentForApps(data.type, data.currency, data.item, data.amount);

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

/**
 * Create payment as intent on history.
 */
router.post("/history", async (request, response) => {
  // TODO: Implement this endpoint
  response.send("// TODO: Implement this endpoint");
});

/**
 * Mark payment as success on history.
 */
router.put("/history", async (request, response) => {
  // TODO: Implement this endpoint
  response.send("// TODO: Implement this endpoint");
});


export default router;
