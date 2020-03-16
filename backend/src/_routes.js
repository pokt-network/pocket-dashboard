import Index from "./apis/IndexApi";
import User from "./apis/UserApi";


export function configureRoutes(expressApp) {
  // Index API
  expressApp.use("/", Index);

  // User API
  expressApp.use("/api/user", User);
}
