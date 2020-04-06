import Login from "./views/Auth/Login/Login";
import ForgotPassword from "./views/Auth/ForgotPassword/ForgotPassword";
import GithubAuthProviderHook from "./core/components/Providers/Auth/GithubAuthProviderHook";
import GoogleAuthProviderHook from "./core/components/Providers/Auth/GoogleAuthProviderHook";
import SecurityQuestions from "./views/Auth/SecurityQuestions/SecurityQuestions";
import SignUp from "./views/Auth/SignUp/SignUp";
import VerifyEMail from "./views/Auth/VerifyEmail/VerifyEmail";
import DefaultLayout from "./core/components/DefaultLayout/DefaultLayout";
import Dashboard from "./views/Dashboard/Dashboard";
import AppsMain from "./views/Dashboard/Apps/AppsMain/AppsMain";
import CreateAppInfo from "./views/Dashboard/Apps/CreateAppInfo/CreateAppInfo";
import ChainList from "./views/Dashboard/Apps/ChainList/ChainList";

export const ROUTE_PATHS = {
  signup: "/signup",
  login: "/login",
  home: "/dashboard",
  forgot_password: "/forgot-password",
  security_questions: "/security-questions",
  verify_email: "/verify-email"
};

export const DASHBOARD_PATHS = {
  home: "/dashboard",
  apps: "/apps",
  createAppInfo: "/apps/new",
  chooseChain: "/apps/chains"
};

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const pageRoutes = [
  {path: ROUTE_PATHS.login, exact: true, name: "Login", component: Login},
  {path: ROUTE_PATHS.forgot_password, exact: true, name: "Forgot Password", component: ForgotPassword},
  {path: ROUTE_PATHS.security_questions, exact: true, name: "Security Questions", component: SecurityQuestions},
  {path: ROUTE_PATHS.signup, exact: true, name: "Sign Up", component: SignUp},
  {path: ROUTE_PATHS.verify_email, exact: true, name: "Verify Email", component: VerifyEMail},
  {path: ROUTE_PATHS.home, exact: false, name: "Home", component: DefaultLayout},
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

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
export const dashboardRoutes = [
  {
    path: DASHBOARD_PATHS.home,
    exact: true,
    name: "Home - Dashboard",
    component: Dashboard,
  },
  {
    path: DASHBOARD_PATHS.createAppInfo,
    exact: true,
    name: "Create New App",
    component: CreateAppInfo,
  },
  {
    path: DASHBOARD_PATHS.chooseChain,
    exact: true,
    name: "Chain list",
    component: ChainList,
  },
  {
    path: DASHBOARD_PATHS.apps,
    exact: true,
    name: "Apps",
    component: AppsMain,
  }
];

const routes = pageRoutes.concat(authProviderRoutes);

export default routes;
