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
import CreateAppForm from "./views/Apps/CreateAppForm/CreateAppForm";
import TierSelection from "./views/Apps/TierSelection/TierSelection";
import FreeTier from "./views/FreeTier/FreeTier";
import ApplicationChainList from "./views/Apps/ChainList/ApplicationChainList";
import Import from "./views/Apps/Import/Import";
import AppDetail from "./views/Apps/AppDetail/AppDetail";
import SelectRelays from "./views/Apps/SelectRelays/SelectRelays";
import NodesMain from "./views/Nodes/NodesMain/NodesMain";
import General from "./views/Profile/General/General";
import Profile from "./views/Profile/ProfileLayout/ProfileLayout";
import ChangePassword from "./views/Profile/ChangePassword/ChangePassword";
import PaymentHistory from "./views/Profile/PaymentHistory/PaymentHistory";
import Checkout from "./views/Payment/Checkout/Checkout";
import CreateNodeForm from "./views/Nodes/CreateNodeForm/CreateNodeForm";
import NodeChainList from "./views/Nodes/NodeChainList/NodeChainList";
import EditApp from "./views/Apps/EditApp/EditApp";
import NodeDetail from "./views/Nodes/NodeDetail/NodeDetail";
import EditNode from "./views/Nodes/EditNode/EditNode";
import PaymentMethods from "./views/Profile/PaymentMethods/PaymentMethods";
import OrderSummary from "./views/Payment/OrderSummary/OrderSummary";
import ResetPassword from "./views/Auth/ResetPassword/ResetPassword";
import AppPassphrase from "./views/Apps/AppPassphrase/AppPassphrase";
import TermsOfService from "./views/Support/TermsOfService";
import PrivacyPolicy from "./views/Support/PrivacyPolicy";
import AnswerSecurityQuestions from "./views/Auth/AnswerSecurityQuestions/AnswerSecurityQuestions";
import SelectValidatorPower from "./views/Nodes/SelectValidatorPower/SelectValidatorPower";
import NodePassphrase from "./views/Nodes/NodePassphrase/Nodepassphrase";
import VerifyChangedEmail from "./views/Auth/VerifyChangedEmail/VerifyChangedEmail";
import UserService from "./core/services/PocketUserService";
import Unsubscribe from "./views/Support/Unsubscribe.js";
// If you are going to import this view, at least add it to the project.
// import GeneralSettings from "./views/Apps/GeneralSettings/GeneralSettings";

export const ROUTE_PATHS = {
  signup: "/signup",
  login: "/login",
  home: "/dashboard",
  forgot_password: "/forgot-password",
  security_questions: "/security-questions",
  answer_security_questions: "/answer-security-questions",
  verify_email: "/verify-email",
  verify_changed_email: "/verify-email-changed",
  reset_password: "/reset-password",
  termsOfService: "/support/terms-of-service",
  privacyPolicy: "/support/privacy-policy",
  unsubscribe: "/support/unsubscribe",
};

export const DASHBOARD_PATHS = {
  home: "",
  apps: "/apps",
  appDetail: "/apps/detail/:address",
  editApp: "/apps/edit/:address",
  importApp: "/apps/import",
  createAppInfo: "/apps/new",
  appPassphrase: "/apps/new/passphrase",
  applicationChainsList: "/apps/new/chains",
  generalSettings: "/apps/generalsettings",
  tierSelection: "/apps/new/tiers",
  selectRelays: "/apps/new/relays",
  freeTier: "/apps/free-tier",
  nodes: "/nodes",
  nodeDetail: "/nodes/detail/:address",
  nodeEdit: "/nodes/edit/:address",
  profile: "/profile",
  createNodeForm: "/nodes/new",
  nodePassphrase: "/nodes/new/passphrase",
  nodeChainList: "/nodes/new/chains",
  selectValidatorPower: "/nodes/new/validator-power",
  importNode: "/nodes/import",
  orderSummary: "/payment/summary",
  invoice: "/payment/invoice",
};

export const PROFILE_PATHS = {
  general: "",
  changePassword: "/password-change",
  paymentHistory: "/payment-history",
  paymentMethods: "/payments",
};

// Helper anonymous function to render routes within the dashboard router
export const _getDashboardPath = (path) => {
  return `${ROUTE_PATHS.home}${path}`;
};

export const BREADCRUMBS = () => {
  const action = UserService.getUserAction();

  return {
    [DASHBOARD_PATHS.home]: ["Status"],

    // Apps
    [DASHBOARD_PATHS.apps]: ["Apps"],
    [DASHBOARD_PATHS.importApp]: ["Apps", "Import App"],
    [DASHBOARD_PATHS.createAppInfo]: ["Apps", action, "App Information"],
    [DASHBOARD_PATHS.appPassphrase]: ["Apps", action, "Create Passphrase"],
    [DASHBOARD_PATHS.applicationChainsList]: ["Apps", action, "Choose Chains"],
    [DASHBOARD_PATHS.tierSelection]: ["Apps", action, "Choose tier"],
    [DASHBOARD_PATHS.selectRelays]: ["Apps", action, "Checkout"],

    // Nodes
    [DASHBOARD_PATHS.nodes]: ["Nodes"],
    [DASHBOARD_PATHS.importNode]: ["Nodes", "Import Node"],
    [DASHBOARD_PATHS.createNodeForm]: ["Nodes", action, "Node Information"],
    [DASHBOARD_PATHS.nodePassphrase]: ["Nodes", action, "Create Passphrase"],
    [DASHBOARD_PATHS.nodeChainList]: ["Nodes", action, "Choose Chains"],
    [DASHBOARD_PATHS.selectValidatorPower]: ["Nodes", action, "Checkout"],

    // Profile paths
    [DASHBOARD_PATHS.profile + PROFILE_PATHS.general]: [
      "User Profile",
      "General Information",
    ],
    [DASHBOARD_PATHS.profile + PROFILE_PATHS.changePassword]: [
      "User Profile",
      "Change your Password",
    ],
    [DASHBOARD_PATHS.profile + PROFILE_PATHS.paymentHistory]: [
      "User Profile",
      "Payment History",
    ],
    [DASHBOARD_PATHS.profile + PROFILE_PATHS.paymentMethods]: [
      "User Profile",
      "Payment Methods",
    ],
  };
};

/**
 * @type {Array<{path: string, exact: boolean, name: string, component: *}>}
 */
const pageRoutes = [
  {path: ROUTE_PATHS.login, exact: true, name: "Login", component: Login},
  {
    path: ROUTE_PATHS.forgot_password,
    exact: true,
    name: "Forgot Password",
    component: ForgotPassword,
  },
  {
    path: ROUTE_PATHS.reset_password,
    exact: true,
    name: "Reset Password",
    component: ResetPassword,
  },
  {
    path: ROUTE_PATHS.security_questions,
    exact: true,
    name: "Security Questions",
    component: SecurityQuestions,
  },
  {
    path: ROUTE_PATHS.answer_security_questions,
    exact: true,
    name: "Answer Security Questions",
    component: AnswerSecurityQuestions,
  },
  {path: ROUTE_PATHS.signup, exact: true, name: "Sign Up", component: SignUp},
  {
    path: ROUTE_PATHS.verify_email,
    exact: true,
    name: "Verify Email",
    component: VerifyEMail,
  },
  {
    path: ROUTE_PATHS.privacyPolicy,
    exact: true,
    name: "Privacy Policy",
    component: PrivacyPolicy,
  },
  {
    path: ROUTE_PATHS.unsubscribe,
    exact: true,
    name: "Unsubscribe",
    component: Unsubscribe,
  },
  {
    path: ROUTE_PATHS.termsOfService,
    exact: true,
    name: "Terms of Service",
    component: TermsOfService,
  },
  {
    path: ROUTE_PATHS.verify_changed_email,
    exact: true,
    name: "Verify Changed Email",
    component: VerifyChangedEmail,
  },
  {
    path: ROUTE_PATHS.home,
    exact: false,
    name: "Home",
    component: DefaultLayout,
  },
];

/**
 * @type {Array<{path: string, exact: boolean, name: string,component: *}>}
 */
const authProviderRoutes = [
  {
    path: "/api/auth/provider/github",
    exact: true,
    name: "Github",
    component: GithubAuthProviderHook,
  },
  {
    path: "/api/auth/provider/google",
    exact: true,
    name: "Google",
    component: GoogleAuthProviderHook,
  },
];

/**
 * @type {Array<{path: string, exact: boolean, name: string, component: *}>}
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
    path: DASHBOARD_PATHS.editApp,
    exact: true,
    name: "App Edit",
    component: EditApp,
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
    path: DASHBOARD_PATHS.appPassphrase,
    exact: true,
    name: "Create App Passhprase",
    component: AppPassphrase,
  },
  {
    path: DASHBOARD_PATHS.nodePassphrase,
    exact: true,
    name: "Create Node Passhprase",
    component: NodePassphrase,
  },
  {
    path: DASHBOARD_PATHS.nodeChainList,
    exact: true,
    name: "Nodes Chain List",
    component: NodeChainList,
  },
  {
    path: DASHBOARD_PATHS.selectValidatorPower,
    exact: true,
    name: "Nodes Select Validator Power",
    component: SelectValidatorPower,
  },
  {
    path: DASHBOARD_PATHS.nodes,
    exact: true,
    name: "Nodes",
    component: NodesMain,
  },
  {
    path: DASHBOARD_PATHS.nodeDetail,
    exact: true,
    name: "Node Detail",
    component: NodeDetail,
  },
  {
    path: DASHBOARD_PATHS.importNode,
    exact: true,

    name: "Node Detail",
    component: Import,
  },
  {
    path: DASHBOARD_PATHS.nodeEdit,
    exact: true,
    name: "Node Edit",
    component: EditNode,
  },
  {
    path: DASHBOARD_PATHS.invoice,
    exact: true,
    name: "Invoice",
    component: Checkout,
  },
  {
    path: DASHBOARD_PATHS.importApp,
    exact: true,
    name: "Import App",
    component: Import,
  },
  {
    path: DASHBOARD_PATHS.applicationChainsList,
    exact: true,
    name: "Application Chain list",
    component: ApplicationChainList,
  },
  // {
  //   path: DASHBOARD_PATHS.generalSettings,
  //   exact: true,
  //   name: "General Settings",
  //   component: GeneralSettings,
  // },
  {
    path: DASHBOARD_PATHS.tierSelection,
    exact: true,
    name: "Tier Selection",
    component: TierSelection,
  },
  {
    path: DASHBOARD_PATHS.selectRelays,
    exact: true,
    name: "Relays Selection",
    component: SelectRelays,
  },
  {
    path: DASHBOARD_PATHS.orderSummary,
    exact: true,
    name: "Order Summary",
    component: OrderSummary,
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
    component: General,
  },
  {
    path: PROFILE_PATHS.changePassword,
    exact: true,
    name: "Change password",
    component: ChangePassword,
  },
  {
    path: PROFILE_PATHS.paymentHistory,
    exact: true,
    name: "Payment history",
    component: PaymentHistory,
  },
  {
    path: PROFILE_PATHS.paymentMethods,
    exact: true,
    name: "Payment methods",
    component: PaymentMethods,
  },
];

const routes = pageRoutes.concat(authProviderRoutes);

export default routes;
