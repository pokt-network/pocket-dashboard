import express from "express";
import UserService from "../services/UserService";
import { SECURITY_QUESTIONS } from "../models/SecurityQuestion";
import { apiAsyncWrapper } from "./_helpers";

const router = express.Router();

const userService = new UserService();

/**
 * Get list of security questions.
 */
router.get(
  "",
  apiAsyncWrapper((req, res) => {
    res.json(SECURITY_QUESTIONS);
  })
);

/**
 * Receive security question with their answers.
 */
router.post(
  "/answered",
  apiAsyncWrapper(async (req, res) => {
    /** @type {{email:string, questions: Array<{question:string, answer:string}>}} */
    const data = req.body;
    const addedOrUpdated = await userService.addOrUpdateUserSecurityQuestions(
      data.email,
      data.questions
    );

    res.send(addedOrUpdated);
  })
);

/**
 * Get user random security question.
 */
router.post(
  "/user/random",
  apiAsyncWrapper(async (req, res) => {
    /** @type {{email:string}} */
    const data = req.body;

    const userSecurityQuestions = await userService.getUserSecurityQuestions(
      data.email
    );
    const randomSecurityQuestion =
      userSecurityQuestions[
        Math.floor(Math.random() * userSecurityQuestions.length)
      ];

    res.send(randomSecurityQuestion);
  })
);

/**
 * Get all the user security questions.
 */
router.post(
  "/user/all",
  apiAsyncWrapper(async (req, res) => {
    /** @type {{email:string}} */
    const data = req.body;

    const userSecurityQuestions = await userService.getUserSecurityQuestions(
      data.email
    );

    res.send(userSecurityQuestions);
  })
);

/**
 * Validate all the user security questions for reset password.
 */
router.post(
  "/user/validate-answers",
  apiAsyncWrapper(async (req, res) => {
    /** @type {{email:string, answeredQuestions:[{question: string, answer: string}]}} */
    const data = req.body;

    const isValid = await userService.validateUserSecurityQuestions(
      data.email,
      data.answeredQuestions
    );

    if (isValid) {
      // Generate the reset password token and expiration date
      const isGenerated = await userService.generateResetPasswordToken(
        data.email
      );

      if (isGenerated) {
        res.send(true);
        return;
      }
    }
    res.send(false);
  })
);

/**
 * Validate answers for the user.
 */
router.post(
  "/user/questions-answer",
  apiAsyncWrapper(async (req, res) => {
    /** @type {{email:string}} */
    const data = req.body;

    const userSecurityQuestions = await userService.getUserSecurityQuestions(
      data.email
    );

    res.send(userSecurityQuestions);
  })
);

export default router;
