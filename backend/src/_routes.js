import Index from "./apis/IndexApi";
import User from "./apis/UserApi";
import SecurityQuestion from "./apis/SecurityQuestionApi";


export function configureRoutes(expressApp) {
  // Index API
  expressApp.use("/", Index);

  // User API
  expressApp.use("/api/users", User);

  // Security Questions API
  expressApp.use("/api/security_questions", SecurityQuestion);
}
