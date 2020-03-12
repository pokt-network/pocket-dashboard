import Index from "./apis";


export function configureRoutes(expressApp) {
  expressApp.use("/", Index);
}
