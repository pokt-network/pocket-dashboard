import express from "express";
import PaymentService from "../services/PaymentService";
import {getOptionalQueryOption, getQueryOption} from "./_helpers";

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
  try {
    /** @type {{user:string, id: string, billingDetails: {name: string, address:{line1:string, postal_code:string, country:string}}}} */
    const data = request.body;

    const saved = await paymentService.savePaymentMethod(data);

    response.send(saved);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Delete a payment method.
 */
router.delete("/payment_method/:paymentMethodID", async (request, response) => {
  try {
    /** @type {{paymentMethodID: string}} */
    const data = request.params;

    const deleted = await paymentService.deletePaymentMethod(data.paymentMethodID);

    response.send(deleted);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});


/**
 * Get user payment methods.
 */
router.post("/payment_methods", async (request, response) => {
  try {
    /** @type {{user:string}} */
    const data = request.body;

    const paymentMethods = await paymentService.getUserPaymentMethods(data.user);

    response.send(paymentMethods);
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
    /** @type {{user:string, type:string, currency: string, item: {account:string, name:string, pokt:string}, amount: number}} */
    const data = request.body;

    const paymentIntent = await paymentService.createPocketPaymentIntentForApps(data.type, data.currency, data.item, data.amount);

    if (paymentIntent) {
      const {id, createdDate, currency, amount} = paymentIntent;

      await paymentService.savePaymentHistory(createdDate, id, currency, amount, data.item, data.user);
    }

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
  try {
    /** @type {{user:string, type:string, currency: string, item: {account:string, name:string, pokt:string}, amount: number}} */
    const data = request.body;

    const paymentIntent = await paymentService.createPocketPaymentIntentForNodes(data.type, data.currency, data.item, data.amount);

    if (paymentIntent) {
      const {id, createdDate, currency, amount} = paymentIntent;

      await paymentService.savePaymentHistory(createdDate, id, currency, amount, data.item, data.user);
    }

    response.send(paymentIntent);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Retrieve history information about payments.
 */
router.post("/history", async (request, response) => {
  try {
    const limit = parseInt(getQueryOption(request, "limit"));

    const offsetData = getOptionalQueryOption(request, "offset");
    const offset = offsetData !== "" ? parseInt(offsetData) : 0;

    /** @type {{user:string}} */
    const data = request.body;

    const paymentHistory = await paymentService.getPaymentHistory(data.user, limit, offset);

    response.send(paymentHistory);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Retrieve history information about payments.
 */
router.get("/history/:paymentID", async (request, response) => {
  try {
    /** @type {{paymentID:string}} */
    const data = request.params;

    const paymentHistory = await paymentService.getPaymentFromHistory(data.paymentID);

    response.send(paymentHistory);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Mark payment as success on history.
 */
router.put("/history", async (request, response) => {
  try {
    /** @type {{user:string, paymentID: string, paymentMethodID:string, billingDetails: {name: string, address:{line1:string, zip_code:string, country:string}}}} */
    const data = request.body;

    const saved = await paymentService.markPaymentAsSuccess(data);

    response.send(saved);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});


export default router;
