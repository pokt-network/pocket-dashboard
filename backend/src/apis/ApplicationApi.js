import express from "express";
import ApplicationService from "../services/ApplicationService";
import {getOptionalQueryOption, getQueryOption} from "./_helpers";
import EmailService from "../services/EmailService";
import PaymentService from "../services/PaymentService";

const router = express.Router();

const applicationService = new ApplicationService();
const paymentService = new PaymentService();

/**
 * Create new application.
 */
router.post("", async (request, response) => {
  try {
    /** @type {{application: {name:string, owner:string, url:string, contactEmail:string, user:string, description:string, icon:string}}} */
    let data = request.body;

    const applicationID = await applicationService.createApplication(data.application);

    response.send(applicationID);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Create new application account.
 */
router.post("/account", async (request, response) => {
  try {
    /** @type {{applicationID: string, passphrase: string, applicationBaseLink:string, privateKey?:string}} */
    let data = request.body;

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

    response.send(applicationData);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Update an application.
 */
router.put("/:applicationAccountAddress", async (request, response) => {
  try {
    /** @type {{name:string, owner:string, url:string, contactEmail:string, user:string, description:string, icon:string}} */
    let data = request.body;

    /** @type {{applicationAccountAddress:string}} */
    const params = request.params;

    const updated = await applicationService.updateApplication(params.applicationAccountAddress, data);

    response.send(updated);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Delete an application from dashboard.
 */
router.post("/:applicationAccountAddress", async (request, response) => {
  try {

    /** @type {{applicationAccountAddress:string}} */
    const data = request.params;
    /** @type {{user:string, appsLink:string}} */
    const bodyData = request.body;

    const application = await applicationService.deleteApplication(data.applicationAccountAddress, bodyData.user);

    if (application) {
      const applicationEmailData = {
        name: application.name,
        appsLink: bodyData.appsLink
      };

      await EmailService.to(bodyData.user).sendAppDeletedEmail(bodyData.user, applicationEmailData);
    }

    response.send(application !== undefined);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Get staked summary data.
 */
router.get("/summary/staked", async (request, response) => {
  try {

    const summaryData = await applicationService.getStakedApplicationSummary();

    response.send(summaryData);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Import application from network.
 */
router.get("/import/:applicationAccountAddress", async (request, response) => {
  try {
    /** @type {{applicationAccountAddress:string}} */
    const data = request.params;
    const application = await applicationService.importApplication(data.applicationAccountAddress);

    response.send(application);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Get application that is already on dashboard by address.
 */
router.get("/:applicationAccountAddress", async (request, response) => {
  try {
    /** @type {{applicationAccountAddress:string}} */
    const data = request.params;
    const application = await applicationService.getApplication(data.applicationAccountAddress);

    response.send(application);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Get all applications.
 */
router.get("", async (request, response) => {
  try {

    const limit = parseInt(getQueryOption(request, "limit"));

    const offsetData = getOptionalQueryOption(request, "offset");
    const offset = offsetData !== "" ? parseInt(offsetData) : 0;

    const statusData = getOptionalQueryOption(request, "status");
    const stakingStatus = statusData !== "" ? parseInt(statusData) : undefined;

    const applications = await applicationService.getAllApplications(limit, offset, stakingStatus);

    response.send(applications);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Get all user applications.
 */
router.post("/user/all", async (request, response) => {
  try {

    const limit = parseInt(getQueryOption(request, "limit"));

    const offsetData = getOptionalQueryOption(request, "offset");
    const offset = offsetData !== "" ? parseInt(offsetData) : 0;

    const statusData = getOptionalQueryOption(request, "status");
    const stakingStatus = statusData !== "" ? parseInt(statusData) : undefined;

    /** @type {{user: string}} */
    const data = request.body;

    const applications = await applicationService.getUserApplications(data.user, limit, offset, stakingStatus);

    response.send(applications);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Stake a free tier application.
 */
router.post("/freetier/stake", async (request, response) => {
  try {

    /** @type {{application: {privateKey: string, passphrase: string}, networkChains: string[]}} */
    const data = request.body;

    const aat = await applicationService.stakeFreeTierApplication(data.application, data.networkChains);

    response.send(aat);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Unstake a free tier application.
 */
router.post("/freetier/unstake", async (request, response) => {
  try {

    /** @type {{application: {privateKey:string, passphrase:string, accountAddress: string}, user: string, appLink: string}} */
    const data = request.body;

    const application = await applicationService.unstakeFreeTierApplication(data.application);

    if (application) {
      const applicationEmailData = {
        name: application.name,
        link: data.appLink
      };

      await EmailService.to(data.user).sendUnstakeAppEmail(data.user, applicationEmailData);

      response.send(true);
    } else {
      response.send(false);
    }
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Stake an application.
 */
router.post("/stake", async (request, response) => {
  try {

    /** @type {{application: {privateKey: string, passphrase: string}, networkChains: string[], payment:{id: string}, applicationLink: string}} */
    const data = request.body;
    const paymentHistory = await paymentService.getPaymentFromHistory(data.payment.id);

    if (paymentHistory.isSuccessPayment(true)) {

      if (paymentHistory.isApplicationPaymentItem(true)) {
        const item = paymentHistory.getItem();
        const application = await applicationService.stakeApplication(data.application, data.networkChains, item.pokt);

        if (application) {
          const applicationEmailData = {
            name: application.name,
            link: data.applicationLink
          };

          const paymentEmailData = {
            amountPaid: paymentHistory.amount,
            maxRelayPerDayAmount: item.maxRelay,
            poktStaked: item.pokt
          };

          await EmailService.to(application.user).sendStakeAppEmail(application.user, applicationEmailData, paymentEmailData);

          response.send(true);
        } else {
          response.send(false);
        }
      }
    }
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Unstake an application.
 */
router.post("/unstake", async (request, response) => {
  try {

    /** @type {{application:{privateKey:string, passphrase:string, accountAddress: string}, applicationLink: string}} */
    const data = request.body;

    const application = await applicationService.unstakeApplication(data.application);

    if (application) {
      const applicationEmailData = {
        name: application.name,
        link: data.applicationLink
      };

      await EmailService.to(application.user).sendUnstakeAppEmail(application.user, applicationEmailData);

      response.send(true);
    } else {
      response.send(false);
    }
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Get AAT for Free tier
 */
router.get("/freetier/aat/:applicationAccountAddress", async (request, response) => {
  try {

    /** @type {{applicationAccountAddress:string}} */
    const data = request.params;

    const aat = await applicationService.getFreeTierAAT(data.applicationAccountAddress);

    response.send(aat);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

export default router;
