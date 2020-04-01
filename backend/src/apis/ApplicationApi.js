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
    /** @type {{name:string, owner:string, url:string, contactEmail:string, user:string, description:string, icon:string }} */
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
 * Get all applications.
 */
router.get("", async (request, response) => {
  try {

    const limit = parseInt(getQueryOption(request, "limit"));
    const offsetData = getOptionalQueryOption(request, "offset");
    const offset = offsetData !== "" ? parseInt(offsetData) : 0;

    const applications = await applicationService.getAllApplications(limit, offset);

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

    /** @type {{user: string}} */
    const data = request.body;

    const applications = await applicationService.getUserApplications(data.user, limit, offset);

    response.send(applications);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

export default router;
