import express from "express";
import UserService from "../services/UserService";
import {SECURITY_QUESTIONS} from "../models/SecurityQuestion";

const router = express.Router();

const userService = new UserService();

/**
 * Get list of security questions.
 */
router.get("", (request, response) => {
  response.send(SECURITY_QUESTIONS);
});

/**
 * Receive security question with their answers.
 */
router.post("/answered", async (request, response) => {
  try {
    /** @type {{email:string, questions: Array<{question:string, answer:string}>}} */
    const data = request.body;
    const addedOrUpdated = await userService.addOrUpdateUserSecurityQuestions(data.email, data.questions);

    response.send(addedOrUpdated);
  } catch (e) {

    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Get user random security question.
 */
router.post("/user/random", async (request, response) => {
  try {
    /** @type {{email:string}} */
    const data = request.body;

    const userSecurityQuestions = await userService.getUserSecurityQuestions(data.email);
    const randomSecurityQuestion = userSecurityQuestions[Math.floor(Math.random() * userSecurityQuestions.length)];

    response.send(randomSecurityQuestion);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});


export default router;
