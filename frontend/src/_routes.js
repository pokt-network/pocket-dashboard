import Login from "./views/Auth/Login/Login";
import ForgotPassword from "./views/Auth/ForgotPassword/ForgotPassword";
import GithubAuthProviderHook from "./core/components/Providers/Auth/GithubAuthProviderHook";
import GoogleAuthProviderHook from "./core/components/Providers/Auth/GoogleAuthProviderHook";
import SecurityQuestions from "./views/Auth/SecurityQuestions/SecurityQuestions";
import SignUp from "./views/Auth/SignUp/SignUp";
import VerifyEMail from "./views/Auth/VerifyEmail/VerifyEmail";
import DefaultLayout from "./core/components/DefaultLayout/DefaultLayout";
import Dashboard from "./views/Dashboard/Dashboard";

export const routePaths = {
  signup: "/signup",
  login: "/login",
  home: "/",
  forgot_password: "/forgot-password",
  security_questions: "/security-questions",
  verify_email: "/verify-email"
};

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const pageRoutes = [
  {path: routePaths.login, exact: true, name: "Login", component: Login},
  {path: routePaths.forgot_password, exact: true, name: "Forgot Password", component: ForgotPassword},
  {path: routePaths.security_questions, exact: true, name: "Security Questions", component: SecurityQuestions},
  {path: routePaths.signup, exact: true, name: "Sign Up", component: SignUp},
  {path: routePaths.verify_email, exact: true, name: "Verify Email", component: VerifyEMail},
  {path: routePaths.home, exact: false, name: "Home", component: DefaultLayout},
];

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const authProviderRoutes = [
  {
    path: "/api/Auth/provider/github",
    exact: true,
    name: "Github",
    component: GithubAuthProviderHook
  },
  {
    path: "/api/Auth/provider/google",
    exact: true,
    name: "Google",
    component: GoogleAuthProviderHook
  }
];

export const dashboardPaths = {
  home: "/dashboard"
};


/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
export const dashboardRoutes = [
  {
    path: dashboardPaths.home,
    exact: true,
    name: "Home - Dashboard",
    component: Dashboard,
  }
];

const routes = pageRoutes.concat(authProviderRoutes, dashboardRoutes);

export default routes;
