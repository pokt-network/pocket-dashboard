import Index from "./apis/IndexApi";
import User from "./apis/UserApi";
import SecurityQuestion from "./apis/SecurityQuestionApi";
import Payment from "./apis/PaymentApi";


export function configureRoutes(expressApp) {
  // Index API
  expressApp.use("/", Index);

  // Users API
  expressApp.use("/api/users", User);

  // Security Questions API
  expressApp.use("/api/security_questions", SecurityQuestion);

  // Payments API
  expressApp.use("/api/payments", Payment);
}
