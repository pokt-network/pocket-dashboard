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
import CreateAppForm from "./views/Apps/CreateAppForm/CreateAppForm";
import TierSelection from "./views/Apps/TierSelection/TierSelection";
import FreeTier from "./views/FreeTier/FreeTier";
import ChainList from "./views/Apps/ChainList/ChainList";
import AppDetail from "./views/Apps/AppDetail/AppDetail";
import SelectRelays from "./views/Apps/SelectRelays/SelectRelays";
import NodesMain from "./views/Nodes/NodesMain/NodesMain";
import General from "./views/Profile/General/General";
import Profile from "./views/Profile/ProfileLayout/ProfileLayout";
import ChangePassword from "./views/Profile/ChangePassword/ChangePassword";
import PaymentHistory from "./views/Profile/PaymentHistory/PaymentHistory";
import NodesCheckout from "./views/Nodes/NodesCheckout/NodesCheckout";
import CreateNodeForm from "./views/Nodes/CreateNodeForm/CreateNodeForm";

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
  tierSelection: "/apps/tiers",
  selectRelays: "/apps/relays",
  freeTier: "/apps/free-tier",
  chooseChain: "/apps/chains",
  appCreated: "/apps/created",
  nodes: "/nodes",
  nodesCheckout: "/nodes/checkout",
  profile: "/profile",
  createNodeForm: "/nodes/new",
};

export const PROFILE_PATHS = {
  general: "",
  changePassword: "/password-change",
  paymentHistory: "/payment-history"
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
    path: "/",
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
    component: CreateAppForm,
  },
  {
    path: DASHBOARD_PATHS.createNodeForm,
    exact: true,
    name: "Create New Node",
    component: CreateNodeForm,
  },
  {
    path: DASHBOARD_PATHS.nodes,
    exact: true,
    name: "Nodes",
    component: NodesMain,
  },
  {
    path: DASHBOARD_PATHS.nodesCheckout,
    exact: true,
    name: "Nodes Checkout",
    component: NodesCheckout,
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
    path: DASHBOARD_PATHS.selectRelays,
    exact: true,
    name: "Relays Selection",
    component: SelectRelays
  },
  {
    path: DASHBOARD_PATHS.freeTier,
    exact: true,
    name: "Free tier",
    component: FreeTier,
  },
  {
    path: DASHBOARD_PATHS.profile,
    exact: false,
    name: "User General",
    component: Profile,
  },
];

export const profileRoutes = [
  {
    path: PROFILE_PATHS.general,
    exact: true,
    name: "General Information",
    component: General
  },
  {
    path: PROFILE_PATHS.changePassword,
    exact: true,
    name: "Change password",
    component: ChangePassword
  },
  {
    path: PROFILE_PATHS.paymentHistory,
    exact: true,
    name: "Payment history",
    component: PaymentHistory
  },
];

const routes = pageRoutes.concat(authProviderRoutes);

export default routes;
