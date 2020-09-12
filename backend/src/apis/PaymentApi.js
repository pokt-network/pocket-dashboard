import express from "express";
import PaymentService from "../services/PaymentService";
import {apiAsyncWrapper, getOptionalQueryOption, getQueryOption} from "./_helpers";
import UserService from "../services/UserService";

const router = express.Router();

const paymentService = new PaymentService();
const userService = new UserService();

/**
 * Get all available currencies.
 */
router.get("/currencies", apiAsyncWrapper((req, res) => {
  const currencies = paymentService.getAvailableCurrencies();

  res.json(currencies);
}));

/**
 * Save a new payment method.
 */
router.post("/payment_method", apiAsyncWrapper(async (req, res) => {
  /** @type {{user:string, paymentMethod: {id: string, card: *}, billingDetails: {name: string, address:{line1:string, postal_code:string, country:string}}}} */
  const data = req.body;
  const userEmail = req.headers.authorization.split(", ")[2].split(" ")[1];

  if (userEmail && data && userEmail.toString() === data.user.toString()) {
    const saved = await paymentService.savePaymentMethod(data);

    res.send(saved);
  } else {
    res.status(400).send("Targeted account doesn't belong to the client.");
  }
}));

/**
 * Delete a payment method.
 */
router.delete("/payment_method/:paymentMethodID", apiAsyncWrapper(async (req, res) => {
  /** @type {{paymentMethodID: string}} */
  const data = req.params;

  const deleted = await paymentService.deletePaymentMethod(data.paymentMethodID, req.headers.authorization);

  res.send(deleted);
}));

/**
 * Get user payment methods.
 */
router.post("/payment_methods", apiAsyncWrapper(async (req, res) => {
  /** @type {{user:string}} */
  const data = req.body;
  const userEmail = req.headers.authorization.split(", ")[2].split(" ")[1];

  if (userEmail && data && userEmail.toString() === data.user.toString()) {
    const paymentMethods = await paymentService.getUserPaymentMethods(data.user);

    res.json(paymentMethods);
  } else {
    res.status(400).send("Targeted account doesn't belong to the client.");
  }
}));


/**
 * Create a new intent of payment for apps.
 */
router.post("/new_intent/apps", apiAsyncWrapper(async (req, res) => {
  /** @type {{user:string, type:string, currency: string, item: {account:string, name:string, maxRelays: string}, amount: number, tokens: number}} */
  const data = req.body;
  const userEmail = req.headers.authorization.split(", ")[2].split(" ")[1];

  if (data && userEmail && userEmail.toString() === data.user.toString()) {

    const paymentIntent = await paymentService.createPocketPaymentIntentForApps(data);
    const {id, createdDate, currency, amount} = paymentIntent;

    await paymentService.savePaymentHistory(createdDate, id, currency, amount, data.item, data.user, data.tokens);
    res.json(paymentIntent);
  } else {
    res.status(400).send("New intent of payment doesn't belong to the client.");
  }
}));

/**
 * Update an existing intent of payment for apps.
 */
router.put("/intent/apps", apiAsyncWrapper(async (req, res) => {
  /** @type {{userEmail:string, type:string, paymentId: string, printableData: {information:[{text: string, value: string}], items: [{text: string, value: string}, total: string]}}} */
  const data = req.body;

  if (await paymentService.verifyPaymentBelongsToClient(data.paymentId, req.headers.authorization)) {
    const result = await paymentService.updatePaymentWithPrintableData(data.paymentId, data.userEmail, data.printableData);
    res.json(result);
  } else {
    res.status(400).send("Intent of payment doesn't belong to the client.");
  }
}));

/**
 * Create a new intent of payment for nodes.
 */
router.post("/new_intent/nodes", apiAsyncWrapper(async (req, res) => {
  /** @type {{user:string, type:string, currency: string, item: {account:string, name:string, validatorPower: string}, amount: number, tokens: number}} */
  const data = req.body;
  const userEmail = req.headers.authorization.split(", ")[2].split(" ")[1];

  if (data && userEmail && userEmail.toString() === data.user.toString()) {
    const paymentIntent = await paymentService.createPocketPaymentIntentForNodes(data);

    if (paymentIntent) {
      const {id, createdDate, currency, amount} = paymentIntent;

      await paymentService.savePaymentHistory(createdDate, id, currency, amount, data.item, data.user, data.tokens);
    }


    res.json(paymentIntent);
  } else {
    res.status(400).send("New intent of payment doesn't belong to the client.");
  }
}));

/**
 * Retrieve history information about payments.
 */
router.post("/history", apiAsyncWrapper(async (req, res) => {
  const limit = parseInt(getQueryOption(req, "limit"));

  const offsetData = getOptionalQueryOption(req, "offset");
  const offset = offsetData !== "" ? parseInt(offsetData) : 0;

  /** @type {{user:string, fromDate: string, toDate: string}} */
  const data = req.body;
  const userEmail = req.headers.authorization.split(", ")[2].split(" ")[1];

  if (data && userEmail && userEmail.toString() === data.user.toString()) {
    const paymentHistory = await paymentService
    .getPaymentHistory(data.user, limit, offset, data.fromDate, data.toDate);

    res.json(paymentHistory);
  } else {
    res.status(400).send("Payment history doesn't belong to the client.");
  }
}));

/**
 * Retrieve history information about payments.
 */
router.get("/history/:paymentID", apiAsyncWrapper(async (req, res) => {
  /** @type {{paymentID:string}} */
  const data = req.params;
  if (await paymentService.verifyPaymentBelongsToClient(data.paymentID, req.headers.authorization)) {
    const paymentHistory = await paymentService.getPaymentFromHistory(data.paymentID, req.headers.authorization);

    res.json(paymentHistory);
  } else {
    res.status(400).send("Payment history doesn't belong to the client.");
  }
}));

/**
 * Mark payment as success on history.
 */
router.put("/history", apiAsyncWrapper(async (req, res) => {
  /** @type {{user:string, paymentID: string, paymentMethodID:string, billingDetails: {name: string, address:{line1:string, zip_code:string, country:string}}}} */
  const data = req.body;
  const userEmail = req.headers.authorization.split(", ")[2].split(" ")[1];

  if (data && userEmail && userEmail.toString() === data.user.toString()) {
    const saved = await paymentService.markPaymentAsSuccess(data);

    res.send(saved);
  } else {
    res.status(400).send("Payment history doesn't belong to the client.");
  }
}));

export default router;
