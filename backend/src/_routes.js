import Index from "./apis";
import User from "./apis/User";


export function configureRoutes(expressApp) {
  // Index API
  expressApp.use("/", Index);

  // User API
  expressApp.use("/api/user", User);
}
