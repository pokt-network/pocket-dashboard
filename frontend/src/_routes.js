import Login from "./views/Auth/Login/Login";
import Dashboard from "./views/Dashboard/Dashboard";
import ForgotPassword from "./views/Auth/ForgotPassword/ForgotPassword";
import GithubAuthProviderHook from "./core/components/providers/auth/GithubAuthProviderHook";
import GoogleAuthProviderHook from "./core/components/providers/auth/GoogleAuthProviderHook";
import SecurityQuestions from './views/Core/SecurityQuestions/SecurityQuestions';
import SignUp from "./views/Auth/SignUp/SignUp";

export const routePaths = {
  signup: "/signup",
  login: "/login",
  home: "/dashboard",
  forgot_password: "/forgot-password",
  security_questions: "/security-questions"
};

/**
 * @type {Array<{path: string, component: Component, exact: boolean, name: string}>}
 */
const pageRoutes = [
  {path: routePaths.login, exact: true, name: "Login", component: Login},
  {path: routePaths.home, exact: true, name: "Dashboard", component: Dashboard},
  {path: routePaths.forgot_password, exact: true, name: "Forgot Password", component: ForgotPassword},
  {path: routePaths.security_questions, exact: true, name: "Security Questions", component: SecurityQuestions},
  {path: routePaths.signup, exact: true, name: "Sign Up", component: SignUp}
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
