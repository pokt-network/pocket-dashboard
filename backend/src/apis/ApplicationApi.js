import express from "express";
import ApplicationService from "../services/ApplicationService";

const router = express.Router();

const applicationService = new ApplicationService();

/**
 * Create new application.
 */
router.post("/", async (request, response) => {
  try {
    /** @type {{name:string, owner:string,url:string,contactEmail:string,user:string,description:string, icon:string }} */
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

export default router;
