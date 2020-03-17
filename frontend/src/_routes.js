import Login from "./views/Core/Login/Login";
import Dashboard from "./views/Core/Dashboard/Dashboard";
import ForgotPassword from "./views/Core/ForgotPassword/ForgotPassword";
import GithubAuthProviderHook from "./core/components/providers/auth/GithubAuthProviderHook";
import GoogleAuthProviderHook from "./core/components/providers/auth/GoogleAuthProviderHook";

export const LOGIN_PATH = "/login";
export const HOME_PATH = "/dashboard";
export const FORGOTPASSWORD_PATH = "/forgot-password";

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const pageRoutes = [
  {path: LOGIN_PATH, exact: true, name: "Login", component: Login},
  {path: HOME_PATH, exact: true, name: "Dashboard", component: Dashboard},
  {path: FORGOTPASSWORD_PATH, exact: true, name: "Forgot Passsword", component: ForgotPassword}
];

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const authProviderRoutes = [
  {path: "/api/auth/provider/github", exact: true, name: "Github", component: GithubAuthProviderHook},
  {path: "/api/auth/provider/google", exact: true, name: "Google", component: GoogleAuthProviderHook},
];

const routes = pageRoutes.concat(authProviderRoutes);

export default routes;
