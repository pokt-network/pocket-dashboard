import express from "express";
import PaymentService from "../services/PaymentService";
import {apiAsyncWrapper, getOptionalQueryOption, getQueryOption} from "./_helpers";

const router = express.Router();

const paymentService = new PaymentService();

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

  const saved = await paymentService.savePaymentMethod(data);

  res.send(saved);
}));

/**
 * Delete a payment method.
 */
router.delete("/payment_method/:paymentMethodID", apiAsyncWrapper(async (req, res) => {
  /** @type {{paymentMethodID: string}} */
  const data = req.params;

  const deleted = await paymentService.deletePaymentMethod(data.paymentMethodID);

  res.send(deleted);
}));


/**
 * Get user payment methods.
 */
router.post("/payment_methods", apiAsyncWrapper(async (req, res) => {
  /** @type {{user:string}} */
  const data = req.body;

  const paymentMethods = await paymentService.getUserPaymentMethods(data.user);

  res.json(paymentMethods);
}));


/**
 * Create a new intent of payment for apps.
 */
router.post("/new_intent/apps", apiAsyncWrapper(async (req, res) => {
  /** @type {{user:string, type:string, currency: string, item: {account:string, name:string, maxRelays: string}, amount: number}} */
  const data = req.body;

  const paymentIntent = await paymentService.createPocketPaymentIntentForApps(data);

  if (paymentIntent) {
    const {id, createdDate, currency, amount} = paymentIntent;

    await paymentService.savePaymentHistory(createdDate, id, currency, amount, data.item, data.user);
  }

  res.json(paymentIntent);
}));

/**
 * Create a new intent of payment for nodes.
 */
router.post("/new_intent/nodes", apiAsyncWrapper(async (req, res) => {
  /** @type {{user:string, type:string, currency: string, item: {account:string, name:string, validatorPower: string}, amount: number}} */
  const data = req.body;

  const paymentIntent = await paymentService.createPocketPaymentIntentForNodes(data);

  if (paymentIntent) {
    const {id, createdDate, currency, amount} = paymentIntent;

    await paymentService.savePaymentHistory(createdDate, id, currency, amount, data.item, data.user);
  }

  res.json(paymentIntent);
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

  const paymentHistory = await paymentService
    .getPaymentHistory(data.user, limit, offset, data.fromDate, data.toDate);

  res.json(paymentHistory);
}));

/**
 * Retrieve history information about payments.
 */
router.get("/history/:paymentID", apiAsyncWrapper(async (req, res) => {
  /** @type {{paymentID:string}} */
  const data = req.params;

  const paymentHistory = await paymentService.getPaymentFromHistory(data.paymentID);

  res.json(paymentHistory);
}));

/**
 * Mark payment as success on history.
 */
router.put("/history", apiAsyncWrapper(async (req, res) => {
  /** @type {{user:string, paymentID: string, paymentMethodID:string, billingDetails: {name: string, address:{line1:string, zip_code:string, country:string}}}} */
  const data = req.body;

  const saved = await paymentService.markPaymentAsSuccess(data);

  res.send(saved);
}));


export default router;
