import express from "express";
import UserService from "../services/UserService";
import {SECURITY_QUESTIONS} from "../models/SecurityQuestion";
import {apiAsyncWrapper} from "./_helpers";

const router = express.Router();

const userService = new UserService();

/**
 * Get list of security questions.
 */
router.get("", apiAsyncWrapper((req, res) => {
  res.json(SECURITY_QUESTIONS);
}));

/**
 * Receive security question with their answers.
 */
router.post("/answered", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string, questions: Array<{question:string, answer:string}>}} */
  const data = req.body;
  const addedOrUpdated = await userService.addOrUpdateUserSecurityQuestions(data.email, data.questions);

  res.send(addedOrUpdated);
}));

/**
 * Get user random security question.
 */
router.post("/user/random", apiAsyncWrapper(async (req, res) => {
  /** @type {{email:string}} */
  const data = req.body;

  const userSecurityQuestions = await userService.getUserSecurityQuestions(data.email);
  const randomSecurityQuestion = userSecurityQuestions[Math.floor(Math.random() * userSecurityQuestions.length)];

  res.send(randomSecurityQuestion);
}));


export default router;
