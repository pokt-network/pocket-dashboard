import express from "express";
import UserService from "../services/UserService";
import EmailService from "../services/EmailService";
import {apiAsyncWrapper} from "./_helpers";

const router = express.Router();

const userService = new UserService();

/**
 * Check if user exists.
 */
router.post("/exists", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, authProvider: string}} */
  const data = req.body;

  const exists = await userService.userExists(data.email, data.authProvider);

  res.send(exists);
}));

/**
 * Provides Auth provider urls to show consent.
 */
router.get("/auth/providers", apiAsyncWrapper((req, res) => {
  res.json(userService.getConsentProviderUrls());
}));

/**
 * User authentication using an Auth provider.
 */
router.post("/auth/provider/login", apiAsyncWrapper(async (req, res) => {
  /** @type {{provider_name:string, code:string}} */
  const data = req.body;
  const user = await userService.authenticateWithAuthProvider(data.provider_name, data.code);

  res.json(user);
}));

/**
 * User authentication using username and password.
 */
router.post("/auth/login", apiAsyncWrapper(async (req, res) => {
  /** @type {{username:string, password:string}} */
  const data = req.body;
  const user = await userService.authenticateUser(data.username, data.password);

  res.json(user);
}));

/**
 * User sign up using email.
 */
router.post("/auth/signup", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, username:string, password1:string, password2:string, postValidationBaseLink:string}} */
  const data = req.body;

  const result = await userService.signupUser(data);

  if (result) {
    const postValidationLink = `${data.postValidationBaseLink}?d=${await userService.generateToken(data.email)}`;

    await EmailService
      .to(data.email)
      .sendSignUpEmail(data.username, postValidationLink);
  }

  res.send(result);
}));

/**
 * User sign up using email.
 */
router.post("/auth/resend-signup-email", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, postValidationBaseLink:string}} */
  const data = req.body;

  const user = await userService.getUser(data.email);

  if (user) {
    const postValidationLink = `${data.postValidationBaseLink}?d=${await userService.generateToken(data.email)}`;

    await EmailService
      .to(data.email)
      .sendSignUpEmail(user.username, postValidationLink);
  }

  res.send(user !== undefined);
}));

/**
 * User logout.
 */
router.post("/auth/logout", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string}} */
  const data = req.body;

  const result = await userService.logout(data.email);

  res.send(result);
}));

/**
 * Check if user is validated.
 */
router.post("/auth/is-validated", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, authProvider: string}} */
  const data = req.body;

  const validated = await userService.isUserValidated(data.email, data.authProvider);

  res.send(validated);
}));

/**
 * Verify user password.
 */
router.post("/auth/verify-password", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, password: string}} */
  const data = req.body;

  const passwordVerified = await userService.verifyPassword(data.email, data.password);

  res.send(passwordVerified);
}));

/**
 * Change user password.
 */
router.put("/auth/change-password", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, password1: string, password2: string}} */
  const data = req.body;

  const passwordChanged = await userService.changePassword(data.email, data.password1, data.password2);

  if (passwordChanged) {
    await EmailService
      .to(data.email)
      .sendPasswordChangedEmail(data.email);
  }

  res.send(passwordChanged);
}));

/**
 * Reset the user password.
 */
router.put("/auth/reset-password", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, token: string, password1: string, password2: string}} */
  const data = req.body;

  const passwordChanged = await userService.resetPassword(data.email, data.token, data.password1, data.password2);

  res.send(passwordChanged);
}));

/**
 * Send's to the user a password reset email.
 */
router.put("/auth/send-reset-password-email", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, passwordResetLinkPage: string}} */
  const data = req.body;

  const token = await userService.retrievePasswordResetToken(data.email);

  if (token) {
    await EmailService
      .to(data.email)
      .sendResetPasswordEmail(data.email, token, data.passwordResetLinkPage);
  }
   
  res.send(true);
}));

/**
 * Change user name.
 */
router.put("/auth/change-username", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, username: string}} */
  const data = req.body;

  const changed = await userService.changeUsername(data.email, data.username);

  res.send(changed);
}));

/**
 * Change user email.
 */
router.put("/auth/change-email", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, newEmail: string, postValidationBaseLink:string}} */
  const data = req.body;

  const emailChanged = await userService.changeEmail(data.email, data.newEmail);

  if (emailChanged) {
    const postValidationLink = `${data.postValidationBaseLink}?d=${await userService.generateToken(data.newEmail)}`;

    await EmailService
      .to(data.newEmail)
      .sendEmailChangedEmail(data.newEmail, postValidationLink);
  }

  res.send(emailChanged);
}));

/**
 * Validate token.
 */
router.post("/validate-token", apiAsyncWrapper(async (req, res) => {
  /** @type {{token:string}} */
  const data = req.body;

  /** @type {{email:string}} */
  const tokenPayload = await userService.decodeToken(data.token);

  if (tokenPayload) {
    const userEmail = tokenPayload.email;

    if (await userService.userExists(userEmail)) {
      const user = await userService.getUser(userEmail);

      res.json({success: true, data: user});
    } else {
      res.json({success: false, data: "User does not exists or is invalid."});
    }
  } else {
    res.json({success: false, data: "Invalid token."});
  }
}));

/**
 * Validate captcha token
 */
router.post("/verify-captcha", apiAsyncWrapper(async (req, res) => {
  /** @type {{token:string}} */
  const {token} = req.body;
  const result = await userService.verifyCaptcha(token);

  res.json(result.data);
}));

/**
 * Unsubscribe email
 */
router.post("/unsubscribe", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string}} */
  const data = req.body;

  const unsubscribed = await EmailService.to(data.email).unsubscribeEmail();

  res.send(unsubscribed);
}));

/**
 * Subscribe email
 */
router.post("/subscribe", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string}} */
  const data = req.body;

  const subscribed = await EmailService.to(data.email).subscribeEmail();

  res.send(subscribed);
}));


export default router;
