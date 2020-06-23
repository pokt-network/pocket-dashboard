import express from "express";
import ApplicationService from "../services/ApplicationService";
import {apiAsyncWrapper, getOptionalQueryOption, getQueryOption} from "./_helpers";
import EmailService from "../services/EmailService";
import PaymentService from "../services/PaymentService";
import ApplicationCheckoutService from "../services/checkout/ApplicationCheckoutService";
import {CoinDenom} from "@pokt-network/pocket-js";

const router = express.Router();

const applicationService = new ApplicationService();
const applicationCheckoutService = ApplicationCheckoutService.getInstance();
const paymentService = new PaymentService();

/**
 * Create new application.
 */
router.post("", apiAsyncWrapper(async (req, res) => {
  /** @type {{application: {name:string, owner:string, url:string, contactEmail:string, user:string, description:string, icon:string}}} */
  const data = req.body;

  const applicationID = await applicationService.createApplication(data.application);

  res.send(applicationID);
}));

/**
 * Save application account.
 */
router.post("/account", apiAsyncWrapper(async (req, res) => {
  /** @type {{applicationID: string, applicationData: {address: string, publicKey: string}, applicationBaseLink:string, ppkData?: object}} */
  const data = req.body;

  const application = await applicationService.saveApplicationAccount(data.applicationID, data.applicationData);
  const emailAction = data.ppkData ? "imported" : "created";
  const applicationEmailData = {
    name: application.name,
    link: `${data.applicationBaseLink}/${data.applicationData.address}`
  };

  if (emailAction === "imported") {
    await EmailService
      .to(application.contactEmail)
      .sendCreateOrImportAppEmail(emailAction, application.contactEmail, applicationEmailData);
  }

  res.send(application);
}));

/**
 * Update an application.
 */
router.put("/:applicationAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{name:string, owner:string, url:string, contactEmail:string, user:string, description:string, icon:string}} */
  let data = req.body;

  /** @type {{applicationAccountAddress:string}} */
  const params = req.params;

  const updated = await applicationService.updateApplication(params.applicationAccountAddress, data);

  res.send(updated);
}));

/**
 * Delete an application from dashboard.
 */
router.post("/:applicationAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{applicationAccountAddress:string}} */
  const data = req.params;
  /** @type {{user:string, appsLink:string}} */
  const bodyData = req.body;

  const application = await applicationService.deleteApplication(data.applicationAccountAddress, bodyData.user);

  if (application) {
    const applicationEmailData = {
      name: application.name,
      appsLink: bodyData.appsLink
    };

    await EmailService
      .to(application.contactEmail)
      .sendAppDeletedEmail(application.contactEmail, applicationEmailData);
  }

  res.send(application !== undefined);
}));

/**
 * Get staked summary data.
 */
router.get("/summary/staked", apiAsyncWrapper(async (req, res) => {
  const summaryData = await applicationService.getStakedApplicationSummary();

  res.json(summaryData);
}));

/**
 * Import application from network.
 */
router.get("/import/:applicationAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{applicationAccountAddress:string}} */
  const data = req.params;
  const application = await applicationService.importApplication(data.applicationAccountAddress);

  res.json(application);
}));

/**
 * Get application that is already on dashboard by address.
 */
router.get("/:applicationAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{applicationAccountAddress:string}} */
  const data = req.params;
  const application = await applicationService.getApplication(data.applicationAccountAddress);

  res.json(application);
}));

/**
 * Get application that is on network by address.
 */
router.get("/network/:applicationAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{applicationAccountAddress:string}} */
  const data = req.params;
  const application = await applicationService.getNetworkApplication(data.applicationAccountAddress);

  res.json(application);
}));

/**
 * Get all applications.
 */
router.get("", apiAsyncWrapper(async (req, res) => {
  const limit = parseInt(getQueryOption(req, "limit"));

  const offsetData = getOptionalQueryOption(req, "offset");
  const offset = offsetData !== "" ? parseInt(offsetData) : 0;

  const applications = await applicationService.getAllApplications(limit, offset);

  res.json(applications);
}));

/**
 * Get all user applications.
 */
router.post("/user/all", apiAsyncWrapper(async (req, res) => {
  const limit = parseInt(getQueryOption(req, "limit"));

  const offsetData = getOptionalQueryOption(req, "offset");
  const offset = offsetData !== "" ? parseInt(offsetData) : 0;

  /** @type {{user: string}} */
  const data = req.body;

  const applications = await applicationService.getUserApplications(data.user, limit, offset);

  res.json(applications);
}));

/**
 * Stake a free tier application.
 */
router.post("/freetier/stake", apiAsyncWrapper(async (req, res) => {
  /** @type {{appStakeTransaction: {address: string, raw_hex_bytes: string}, applicationLink: string}} */
  const data = req.body;

  const appStakeTransaction = data.appStakeTransaction;
  const application = await applicationService.getApplication(appStakeTransaction.address);

  const applicationEmailData = {
    name: application.pocketApplication.name,
    link: data.applicationLink
  };

  const aat = await applicationService.stakeFreeTierApplication(application, data.appStakeTransaction, applicationEmailData);

  res.json(aat);
}));

/**
 * Unstake a free tier application.
 */
router.post("/freetier/unstake", apiAsyncWrapper(async (req, res) => {
  /** @type {{appUnstakeTransaction: {address: string, raw_hex_bytes: string}, applicationLink: string}} */
  const data = req.body;

  await applicationService.unstakeFreeTierApplication(data.appUnstakeTransaction, data.applicationLink);

  res.send(true);
}));

/**
 * Stake an application.
 */
router.post("/custom/stake", apiAsyncWrapper(async (req, res) => {
  /** @type {{appStakeTransaction: {address: string, raw_hex_bytes: string}, payment:{id: string}, applicationLink: string}} */
  const data = req.body;
  const paymentHistory = await paymentService.getPaymentFromHistory(data.payment.id);

  if (
    paymentHistory.isSuccessPayment(true) &&
    paymentHistory.isApplicationPaymentItem(true)
  ) {
    const appStakeTransaction = data.appStakeTransaction;
    const application = await applicationService.getApplication(appStakeTransaction.address);

    const item = paymentHistory.getItem();
    const amountToSpent = applicationCheckoutService.getMoneyToSpent(parseInt(item.maxRelays));
    const poktStaked = applicationCheckoutService.getPoktToStake(amountToSpent, CoinDenom.Pokt).toString();
    const uPoktStaked = applicationCheckoutService.getPoktToStake(amountToSpent, CoinDenom.Upokt).toString();

    const applicationEmailData = {
      name: application.pocketApplication.name,
      link: data.applicationLink
    };

    const paymentEmailData = {
      amountPaid: paymentHistory.amount,
      maxRelayPerDayAmount: item.maxRelays,
      poktStaked: poktStaked
    };

    await applicationService.stakeApplication(appStakeTransaction.address, uPoktStaked, appStakeTransaction, application, applicationEmailData, paymentEmailData);
    res.send(true);
  } else {
    // Return error if payment was unsuccessful
    throw new Error("Error processing payment, please try a different method");
  }
}));

/**
 * Unstake an application.
 */
router.post("/custom/unstake", apiAsyncWrapper(async (req, res) => {
  /** @type {{appUnstakeTransaction: {address: string, raw_hex_bytes: string}, applicationLink: string}} */
  const data = req.body;
  const {
    appUnstakeTransaction,
    applicationLink
  } = data;

  // Submit Unstake transaction to the pocket network
  await applicationService.unstakeApplication(appUnstakeTransaction, applicationLink);

  // Respond
  res.send(true);
}));

/**
 * Get AAT for Free tier
 */
router.get("/freetier/aat/:applicationAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{applicationAccountAddress:string}} */
  const data = req.params;

  const aat = await applicationService.getFreeTierAAT(data.applicationAccountAddress);

  res.json(aat);
}));

export default router;
