import express from "express";
import AccountService from "../services/AccountService";

const router = express.Router();

const accountService = new AccountService();

/**
 * Import account.
 */
router.post("/import", async (request, response) => {
  try {
    /** @type {{ppkData:object, passphrase: string}} */
    const data = request.body;
    const account = await accountService.importDashboardAccountToNetworkFromPPK(data.ppkData, data.passphrase);

    response.send(account);
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

    const balance = await accountService.getBalance(params.accountAddress);

    response.send({balance});
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

router.get("/balance/pokt/:accountAddress", async (request, response) => {
  try {

    /** @type {{accountAddress:string}} */
    const params = request.params;

    const balance = await accountService.getPoktBalance(params.accountAddress);

    response.send({balance});
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});


export default router;
