import express from "express";
import UserService from "../services/UserService";

const router = express.Router();

/** @type UserService */
const userService = new UserService();

router.get("/auth/providers", (request, response) => {
  response.send(userService.getConsentProviderUrls());
});

router.post("/auth/provider/login", async (request, response) => {
  try {
    /** @type {{provider_name:string, code:string}} */
    const data = request.body;
    const user = await userService.authenticateWithAuthProvider(data.provider_name, data.code);

    response.send(user);
  } catch (e) {
    response.status(400).send(e);
  }

});


export default router;
