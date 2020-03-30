import Index from "./apis/IndexApi";
import User from "./apis/UserApi";
import SecurityQuestion from "./apis/SecurityQuestionApi";
import Payment from "./apis/PaymentApi";
import Application from "./apis/ApplicationApi";

/**
 * @param {object} expressApp Express application object.
 */
export function configureRoutes(expressApp) {
  // Index API
  expressApp.use("/", Index);

  // Users API
  expressApp.use("/api/users", User);

  // Security Questions API
  expressApp.use("/api/security_questions", SecurityQuestion);

  // Payments API
  expressApp.use("/api/payments", Payment);

  // Application API
  expressApp.use("/api/applications", Application);
}
