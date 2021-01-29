import express from "express";
import AccountService from "../services/AccountService";
import { apiAsyncWrapper } from "./_helpers";

const router = express.Router();

const accountService = new AccountService();

/**
 * Import account.
 */
router.post("/import", apiAsyncWrapper(async (req, res) => {
  /** @type {{ppkData:object, passphrase: string}} */
  const data = req.body;
  const account = await accountService.importDashboardAccountToNetworkFromPPK(data.ppkData, data.passphrase);

  res.json(account);
}));

router.get("/balance/:accountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{accountAddress:string}} */
  const params = req.params;

  const balance = await accountService.getBalance(params.accountAddress);

  res.json({ balance });
}));

router.get("/balance/pokt/:accountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{accountAddress:string}} */
  const params = req.params;

  const balance = await accountService.getPoktBalance(params.accountAddress);

  res.json({ balance });
}));


export default router;
