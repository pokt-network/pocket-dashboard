import express from "express";
import {NetworkChain} from "../models/Network";

const router = express.Router();

/**
 * Get all available network chains.
 */
router.get("/chains", async (request, response) => {
  try {

    const chains = NetworkChain.getAvailableNetworkChains();

    response.send(chains);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

export default router;
