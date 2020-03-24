import express from "express";

const router = express.Router();

/**
 * Retrieve history information about payments.
 */
router.get("/history", (request, response) => {
  response.send("// TODO: Implement this endpoint");
});

/**
 * Make a new intent of payment.
 */
router.get("/make_intent", (request, response) => {
  response.send("// TODO: Implement this endpoint");
});

export default router;
