import express from "express";
import {NetworkChain} from "../models/Network";
import NetworkService from "../services/NetworkService";
import {apiAsyncWrapper} from "./_helpers";

const router = express.Router();

const networkService = new NetworkService();

/**
 * Get all available network chains.
 */
router.get("/chains", apiAsyncWrapper(async (req, res) => {
  const chains = NetworkChain.getAvailableNetworkChains();

  res.json(chains);
}));

/**
 * Get network chains from hashes.
 */
router.post("/chains", apiAsyncWrapper(async (req, res) => {
  /** @type {{networkHashes: string[]}} */
  const data = req.body;

  const chains = NetworkChain.getNetworkChains(data.networkHashes);

  res.json(chains);
}));

/**
 * Get network summary data.
 */
router.get("/summary", apiAsyncWrapper(async (req, res) => {
  const networkData = await networkService.getNetworkSummaryData();

  res.json(networkData);
}));

export default router;
