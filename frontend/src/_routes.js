import Login from "./views/Core/Login/Login";
import Dashboard from "./views/Core/Dashboard/Dashboard";
import ForgotPassword from "./views/Core/ForgotPassword/ForgotPassword";
import GithubAuthProviderHook from "./core/components/providers/auth/GithubAuthProviderHook";
import GoogleAuthProviderHook from "./core/components/providers/auth/GoogleAuthProviderHook";
import SignUp from "./views/Core/SignUp/SignUp";

export const routePaths = {
  signup: "/signup",
  login: "/login",
  home: "/dashboard",
  forgot_password: "/forgot-password"
};

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const pageRoutes = [
  {path: routePaths.login, exact: true, name: "Login", component: Login},
  {path: routePaths.home, exact: true, name: "Dashboard", component: Dashboard},
  {path: routePaths.forgot_password, exact: true, name: "Forgot Password", component: ForgotPassword},
  { path: routePaths.signup, exact: true, name: "Sign Up", component: SignUp }
];

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const authProviderRoutes = [
  {
    path: "/api/auth/provider/github",
    exact: true,
    name: "Github",
    component: GithubAuthProviderHook
  },
  {
    path: "/api/auth/provider/google",
    exact: true,
    name: "Google",
    component: GoogleAuthProviderHook
  }
];

const routes = pageRoutes.concat(authProviderRoutes);

export default routes;
