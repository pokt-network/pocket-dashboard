import express from "express";
import ApplicationService from "../services/ApplicationService";

const router = express.Router();

const applicationService = new ApplicationService();

/**
 * @param {{query:object}} request Request.
 * @param {string} option Option.
 *
 * @returns {string} Query option value.
 */
function getQueryOption(request, option) {
  const parsedData = request.query;

  // eslint-disable-next-line no-prototype-builtins
  if (!parsedData.hasOwnProperty(option)) {
    throw Error(`${option} query parameter is required.`);
  }

  if (parsedData[option] === undefined) {
    throw Error(`${option} query parameter cannot be null.`);
  }

  return parsedData[option];
}

/**
 * @param {{query:object}} request Request.
 * @param {string} option Option.
 *
 * @returns {string} Query option value.
 */
function getOptionalQueryOption(request, option) {
  const parsedData = request.query;

  // eslint-disable-next-line no-prototype-builtins
  if (!parsedData.hasOwnProperty(option)) {
    return "";
  }

  if (parsedData[option] === undefined) {
    return "";
  }

  return parsedData[option];
}

/**
 * Create new application.
 */
router.post("", async (request, response) => {
  try {
    /** @type {{application: {name:string, owner:string, url:string, contactEmail:string, user:string, description:string, icon:string}, privateKey:string}} */
    const data = request.body;
    const application = await applicationService.createApplication(data);

    response.send(application);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Import application account.
 */
router.post("/import", async (request, response) => {
  try {
    /** @type {{applicationAccountPrivateKey:string}} */
    const data = request.body;
    const account = await applicationService.importApplicationNetworkAccount(data.applicationAccountPrivateKey);

    response.send(account);
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
router.delete("/:applicationAccountAddress", async (request, response) => {
  try {

    /** @type {{applicationAccountAddress:string}} */
    const data = request.params;

    const deleted = await applicationService.deleteApplication(data.applicationAccountAddress);

    response.send(deleted);
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
 * Get application data from network.
 */
router.get("/network/:applicationAccountAddress", async (request, response) => {
  try {
    /** @type {{applicationAccountAddress:string}} */
    const data = request.params;
    const application = await applicationService.getApplicationFromNetwork(data.applicationAccountAddress);

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
router.post("/user", async (request, response) => {
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
 * Mark as a free tier application.
 */
router.post("/freetier", async (request, response) => {
  try {

    /** @type {{applicationAccountAddress: string, networkChains: string[]}} */
    const data = request.body;

    const aat = await applicationService.markAsFreeTierApplication(data.applicationAccountAddress, data.networkChains);

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

    /** @type {{applicationAccountAddress: string}} */
    const data = request.body;

    const unstaked = await applicationService.unstakeFreeTierApplication(data.applicationAccountAddress);

    response.send(unstaked);
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
