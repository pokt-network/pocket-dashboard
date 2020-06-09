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
 * Create new application account.
 */
router.post("/account", apiAsyncWrapper(async (req, res) => {
  /** @type {{applicationID: string, passphrase: string, applicationBaseLink:string, privateKey?:string}} */
  let data = req.body;

  if (!("privateKey" in data)) {
    data["privateKey"] = "";
  }

  const applicationData = await applicationService.createApplicationAccount(data.applicationID, data.passphrase, data.privateKey);
  const emailAction = data.privateKey ? "imported" : "created";
  const applicationEmailData = {
    name: applicationData.application.name,
    link: `${data.applicationBaseLink}/${applicationData.privateApplicationData.address}`
  };

  await EmailService
    .to(applicationData.application.contactEmail)
    .sendCreateOrImportAppEmail(emailAction, applicationData.application.contactEmail, applicationEmailData);

  res.send(applicationData);
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
  /** @type {{application: {privateKey: string, passphrase: string}, networkChains: string[]}} */
  const data = req.body;

  const aat = await applicationService.stakeFreeTierApplication(data.application, data.networkChains);

  res.json(aat);
}));

/**
 * Unstake a free tier application.
 */
router.post("/freetier/unstake", apiAsyncWrapper(async (req, res) => {
  /** @type {{application: {privateKey:string, passphrase:string, accountAddress: string}}} */
  const data = req.body;

  const application = await applicationService.unstakeFreeTierApplication(data.application);

  res.send(application !== undefined);
}));

/**
 * Stake an application.
 */
router.post("/custom/stake", apiAsyncWrapper(async (req, res) => {
  /** @type {{application: {privateKey: string, passphrase: string}, networkChains: string[], payment:{id: string}, applicationLink: string}} */
  const data = req.body;
  const paymentHistory = await paymentService.getPaymentFromHistory(data.payment.id);

  if (paymentHistory.isSuccessPayment(true)) {

    if (paymentHistory.isApplicationPaymentItem(true)) {
      const item = paymentHistory.getItem();
      const amountToSpent = applicationCheckoutService.getMoneyToSpent(parseInt(item.maxRelays));
      const poktToStake = applicationCheckoutService.getPoktToStake(amountToSpent);

      const application = await applicationService.stakeApplication(data.application, data.networkChains, poktToStake.toString());

      if (application) {
        const applicationEmailData = {
          name: application.name,
          link: data.applicationLink
        };

        const paymentEmailData = {
          amountPaid: paymentHistory.amount,
          maxRelayPerDayAmount: item.maxRelays,
          poktStaked: applicationCheckoutService.getPoktToStake(amountToSpent, CoinDenom.Pokt).toString()
        };

        await EmailService
          .to(application.contactEmail)
          .sendStakeAppEmail(application.contactEmail, applicationEmailData, paymentEmailData);

        res.send(true);
      }
    }
  }
  // noinspection ExceptionCaughtLocallyJS
  throw new Error("Error has occurred trying to stake application.");
}));

/**
 * Unstake an application.
 */
router.post("/custom/unstake", apiAsyncWrapper(async (req, res) => {
  /** @type {{application:{privateKey:string, passphrase:string, accountAddress: string}, applicationLink: string}} */
  const data = req.body;

  const application = await applicationService.unstakeApplication(data.application);

  if (application) {
    const applicationEmailData = {
      name: application.name,
      link: data.applicationLink
    };

    await EmailService
      .to(application.contactEmail)
      .sendUnstakeAppEmail(application.contactEmail, applicationEmailData);

    res.send(true);
  } else {
    res.send(false);
  }
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
