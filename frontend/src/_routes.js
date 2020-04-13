import Login from "./views/Auth/Login/Login";
import ForgotPassword from "./views/Auth/ForgotPassword/ForgotPassword";
import GithubAuthProviderHook from "./core/components/Providers/Auth/GithubAuthProviderHook";
import GoogleAuthProviderHook from "./core/components/Providers/Auth/GoogleAuthProviderHook";
import SecurityQuestions from "./views/Auth/SecurityQuestions/SecurityQuestions";
import SignUp from "./views/Auth/SignUp/SignUp";
import VerifyEMail from "./views/Auth/VerifyEmail/VerifyEmail";
import DefaultLayout from "./core/components/DefaultLayout/DefaultLayout";
import Dashboard from "./views/Dashboard/Dashboard";
import AppsMain from "./views/Apps/AppsMain/AppsMain";
import AppCreated from "./views/Apps/AppCreated/AppCreated";
import CreateAppInfo from "./views/Apps/CreateAppInfo/CreateAppInfo";
import TierSelection from "./views/Apps/TierSelection/TierSelection";
import FreeTier from "./views/FreeTier/FreeTier";
import ChainList from "./views/Apps/ChainList/ChainList";
import Import from "./views/Apps/Import/Import";
import AppDetail from "./views/Apps/AppDetail/AppDetail";

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
  appDetail: "/apps/detail/:address",
  createAppInfo: "/apps/new",
  importApp: "/apps/import",
  tierSelection: "/apps/tiers",
  freeTier: "/apps/free-tier",
  chooseChain: "/apps/chains",
  appCreated: "/apps/created",
};

// Helper anonymous function to render routes within the dashboard router
export const _getDashboardPath = (path) => {
  return `${DASHBOARD_PATHS.home}${path}`;
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
    path: DASHBOARD_PATHS.apps,
    exact: true,
    name: "Apps",
    component: AppsMain,
  },
  {
    path: DASHBOARD_PATHS.appDetail,
    exact: true,
    name: "App Detail",
    component: AppDetail,
  },
  {
    path: DASHBOARD_PATHS.appCreated,
    exact: true,
    name: "App creation",
    component: AppCreated,
  },
  {
    path: DASHBOARD_PATHS.createAppInfo,
    exact: true,
    name: "Create New App",
    component: CreateAppInfo,
  },
  {
    path: DASHBOARD_PATHS.importApp,
    exact: true,
    name: "Import App",
    component: Import,
  },
  {
    path: DASHBOARD_PATHS.chooseChain,
    exact: true,
    name: "Chain list",
    component: ChainList,
  },
  {
    path: DASHBOARD_PATHS.tierSelection,
    exact: true,
    name: "Tier Selection",
    component: TierSelection
  },
  {
    path: DASHBOARD_PATHS.freeTier,
    exact: true,
    name: "Free tier",
    component: FreeTier,
  },
];

const routes = pageRoutes.concat(authProviderRoutes);

export default routes;
