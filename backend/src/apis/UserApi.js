import express from "express";
import UserService from "../services/UserService";
import EmailService from "../services/EmailService";

const router = express.Router();

const userService = new UserService();

/**
 * Provides Auth provider urls to show consent.
 */
router.get("/auth/providers", (request, response) => {
  response.send(userService.getConsentProviderUrls());
});

/**
 * User authentication using an Auth provider.
 */
router.post("/auth/provider/login", async (request, response) => {
  try {
    /** @type {{provider_name:string, code:string}} */
    const data = request.body;
    const user = await userService.authenticateWithAuthProvider(data.provider_name, data.code);

    response.send(user);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }

});

/**
 * User authentication using username and password.
 */
router.post("/auth/login", async (request, response) => {
  try {
    /** @type {{username:string, password:string}} */
    const data = request.body;
    const user = await userService.authenticateUser(data.username, data.password);

    response.send(user);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }

});

/**
 * User sign up using email.
 */
router.post("/auth/signup", async (request, response) => {
  try {
    /** @type {{email:string, username:string, password1:string, password2:string, postValidationBaseLink:string}} */
    const data = request.body;

    const result = await userService.signupUser(data);

    if (result) {
      const postValidationLink = `${data.postValidationBaseLink}?d=${await userService.generateToken(data.email)}`;

      await EmailService.to(data.email).sendSignUpEmail(data.username, postValidationLink);
    }

    response.send(result);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }

});

/**
 * User sign up using email.
 */
router.post("/auth/resend_signup_email", async (request, response) => {
  try {
    /** @type {{email:string, postValidationBaseLink:string}} */
    const data = request.body;

    const user = await userService.getUser(data.email);

    if (user) {
      const postValidationLink = `${data.postValidationBaseLink}?d=${await userService.generateToken(data.email)}`;

      await EmailService.to(data.email).sendSignUpEmail(user.username, postValidationLink);
    }

    response.send(user !== undefined);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }

});

/**
 * Validate token.
 */
router.post("/validate_token", async (request, response) => {
  try {
    /** @type {{token:string}} */
    const data = request.body;

    /** @type {{email:string}} */
    const tokenPayload = await userService.decodeToken(data.token);

    if (tokenPayload) {
      const userEmail = tokenPayload.email;

      if (await userService.userExists(userEmail)) {
        const user = await userService.getUser(userEmail);

        response.send({success: true, data: user});
      }

      response.send({success: false, data: "User does not exists or is invalid."});
    } else {
      response.send({success: false, data: "Invalid token."});
    }
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }

});

/**
 * User logout.
 */
router.post("/auth/logout", async (request, response) => {
  try {
    /** @type {{email:string}} */
    const data = request.body;

    const result = await userService.logout(data.email);

    response.send(result);
  } catch (e) {
    response.send(false);
  }

});


export default router;
