import Login from "./views/Core/Login/Login";
import Dashboard from "./views/Core/Dashboard/Dashboard";
import GithubAuthProvider from "./core/components/providers/auth/GithubAuthProvider";
import GoogleAuthProvider from "./core/components/providers/auth/GoogleAuthProvider";

export const LOGIN_PATH = "/login";
export const HOME_PATH = "/dashboard";

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const pageRoutes = [
  {path: LOGIN_PATH, exact: true, name: "Login", component: Login},
  {path: HOME_PATH, exact: true, name: "Dashboard", component: Dashboard},
];

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const authProviderRoutes = [
  {path: "/api/auth/provider/github", exact: true, name: "Github", component: GithubAuthProvider},
  {path: "/api/auth/provider/google", exact: true, name: "Google", component: GoogleAuthProvider},
];

const routes = pageRoutes.concat(authProviderRoutes);

export default routes;
