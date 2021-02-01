import PocketBaseService from "./PocketBaseService";
import SecureLS from "secure-ls";
import { Configurations } from "../../_configuration";
import axiosInstance from "./_serviceHelper";
const axios = axiosInstance();

export const AUTH_PROVIDERS = {
  email: "email",
  github: "github",
  google: "google",
};

class PocketUserService extends PocketBaseService {
  constructor() {
    super("api/users");
    this.ls = new SecureLS(Configurations.secureLS);
  }

  /**
   * Save user data in local storage.
   *
   * @param {{username:string,email:string,provider:string}} user Pocket User to save.
   * @param {{accessToken: string, refreshToken: string}} session User session and refresh token.
   * @param {boolean} loggedIn If user is logged in.
   */
  saveUserInCache(user, session, loggedIn) {
    try {
      this.ls.set("is_logged_in", { data: loggedIn });
      this.ls.set("user_name", { data: user.username });
      this.ls.set("user_email", { data: user.email });
      this.ls.set("user_provider", { data: user.provider });
      this.ls.set("access_token", { data: session.accessToken });
      this.ls.set("refresh_token", { data: session.refreshToken });
      this.ls.set("session_expiry", {
        data:
          Math.floor(+new Date() / 1000) +
          parseInt(Configurations.sessionLength),
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  /**
   * Update the user session information in local storage.
   *
   * @param {{username:string,email:string,provider:string}} user Pocket User to save.
   * @param {{accessToken: string, refreshToken: string}} session User session and refresh token.
   * @param {boolean} loggedIn If user is logged in.
   */
  saveUserSessionInCache(session) {
    this.ls.set("access_token", { data: session.accessToken });
    this.ls.set("refresh_token", { data: session.refreshToken });
  }

  /**
   * Save whether show message or not.
   *
   * @param {boolean} show status of show.
   */
  showWelcomeMessage(show) {
    localStorage.setItem("welcome_message", show.toString());
  }

  getShowWelcomeMessage() {
    return localStorage.getItem("welcome_message") === "true";
  }

  /**
   * Remove user data from local storage.
   */
  removeUserFromCached() {
    this.ls.remove("user_name");
    this.ls.remove("user_email");
    this.ls.remove("user_provider");
    this.ls.remove("access_token");
    this.ls.remove("refresh_token");
    this.ls.remove("session_expiry");
    this.ls.remove("is_logged_in");
  }

  /**
   * @return {boolean}
   */
  isLoggedIn() {
    if (
      this.ls.getAllKeys().includes("is_logged_in") &&
      this.ls.get("is_logged_in").data === true &&
      this.ls.getAllKeys().includes("session_expiry") &&
      parseInt(this.ls.get("session_expiry").data) >
        Math.floor(+new Date() / 1000)
    ) {
      // Update session expiry to keep user logged in
      this.ls.set("session_expiry", {
        data:
          Math.floor(+new Date() / 1000) +
          parseInt(Configurations.sessionLength),
      });
      return true;
    }
    return false;
  }

  /**
   * Get logged user information.
   *
   * @return {{provider: string, name: string, email: string}}
   */
  getUserInfo() {
    if (this.isLoggedIn()) {
      return {
        name: this.ls.get("user_name").data,
        email: this.ls.get("user_email").data,
        provider: this.ls.get("user_provider").data,
        accessToken: this.ls.get("access_token").data,
        refreshToken: this.ls.get("refresh_token").data,
        sessionExpiry: this.ls.get("session_expiry").data,
      };
    } else {
      return {
        name: "",
        email: "",
        provider: "",
        accessToken: "",
        refreshToken: "",
      };
    }
  }

  /**
   * @param {string} action Current action of user (i.e create app, stake node...)
   */
  saveUserAction(action) {
    localStorage.setItem("user_action", action);
  }

  /**
   * Get current user action
   *
   * @return {action:string}
   */
  getUserAction() {
    return localStorage.getItem("user_action");
  }

  /**
   * Validate a token.
   *
   * @param {string} token Token to validate.
   *
   * @return {Promise<*>}
   */
  validateToken(token) {
    return axios
      .post(this._getURL("validate-token"), { token })
      .then(response => response.data)
      .catch(err => {
        return {
          success: false,
          data: err,
        };
      });
  }

  /**
   * Get available Auth Providers.
   *
   * @return {Promise|Promise<Array.<{name:string, consent_url:string}>>}
   */
  getAuthProviders() {
    return axios
      .get(this._getURL("auth/providers"))
      .then(response => response.data);
  }

  /**
   * @param {Array.<{name:string, consent_url:string}>} authProviders Name of Auth provider.
   * @param {string} name Name of Auth provider.
   *
   * @return {{name: string, consent_url:string}}
   */
  getAuthProvider(authProviders, name) {
    return authProviders.filter(
      value => value.name.toLowerCase() === name.toLowerCase()
    )[0];
  }

  /**
   * Login using an Auth provider.
   *
   * @param {string} providerName Name of Auth provider.
   * @param {string} code Code returned by Auth provider.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   */
  async loginWithAuthProvider(providerName, code) {
    const data = {
      provider_name: providerName,
      code,
    };

    return axios
      .post(this._getURL("auth/provider/login"), data)
      .then(response => {
        if (response.status === 200) {
          this.saveUserInCache(response.data, true);

          return {
            success: true,
          };
        }

        return {
          success: false,
        };
      })
      .catch(err => {
        return {
          success: false,
          data: err,
        };
      });
  }

  /**
   * Login user with email.
   *
   * @param {string} username Username of user to login.
   * @param {string} password Password of user.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async login(username, password) {
    const data = {
      username,
      password,
    };

    return axios
      .post(this._getURL("auth/login"), data)
      .then(response => {
        if (response.status === 200) {
          this.saveUserInCache(response.data, true);

          return {
            success: true,
            data: response.data,
          };
        }

        return {
          success: false,
        };
      })
      .catch(err => {
        return {
          success: false,
          data: err,
        };
      });
  }

  /**
   * Register new user.
   *
   * @param {string} username Username of user to login.
   * @param {string} email Email of user.
   * @param {string} password1 Password of user.
   * @param {string} password2 Repeated password of user.
   * @param {string} securityQuestionPageLink Link to security question page.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async signUp(
    username,
    email,
    password1,
    password2,
    securityQuestionPageLink
  ) {
    const data = {
      username,
      email,
      password1,
      password2,
      postValidationBaseLink: securityQuestionPageLink,
    };

    return axios
      .post(this._getURL("auth/signup"), data)
      .then(response => {
        if (response.status === 200) {
          return {
            success: true,
          };
        }

        return {
          success: false,
        };
      })
      .catch(err => {
        return {
          success: false,
          data: err,
        };
      });
  }

  /**
   * Resend sign up email.
   *
   * @param {string} email Email of user.
   * @param {string} securityQuestionPageLink Link to security question page.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   */
  resendSignUpEmail(email, securityQuestionPageLink) {
    const data = {
      email,
      postValidationBaseLink: securityQuestionPageLink,
    };

    return axios
      .post(this._getURL("auth/resend-signup-email"), data)
      .then(response => {
        return {
          success: response.data,
        };
      })
      .catch(err => {
        return {
          success: false,
          data: err,
        };
      });
  }

  logout() {
    this.removeUserFromCached();
  }

  /**
   * Check if user exists or not.
   *
   * @param {string} userEmail User email.
   * @param {string} authProvider Auth provider (could be email, github, google).
   *
   * @return {Promise<*>} If exists returns true, otherwise false.
   */
  userExists(userEmail, authProvider) {
    const data = {
      email: userEmail,
      authProvider,
    };

    return axios
      .post(this._getURL("exists"), data)
      .then(response => response.data);
  }

  /**
   * Check if user is validated or not.
   *
   * @param {string} userEmail User email.
   * @param {string} authProvider Auth provider (could be email, github, google).
   *
   * @return {Promise<*>} If validated returns true, otherwise false.
   */
  isUserValidated(userEmail, authProvider) {
    const data = {
      email: userEmail,
      authProvider,
    };

    return axios
      .post(this._getURL("auth/is-validated"), data)
      .then(response => response.data);
  }

  /**
   * Check if user password is valid or not.
   *
   * @param {string} userEmail User email.
   * @param {string} password Password to verify.
   *
   * @return {Promise<*>} If is valid returns true, otherwise false.
   */
  verifyPassword(userEmail, password) {
    const data = {
      email: userEmail,
      password,
    };

    return axios
      .post(this._getURL("auth/verify-password"), data)
      .then(response => response.data);
  }

  /**
   * Change user password.
   *
   * @param {string} userEmail User email.
   * @param {string} oldPassword Answered question.
   * @param {string} password1 New password.
   * @param {string} password2 Password confirmation.
   *
   * @return {Promise<*>} If password was changed returns true, otherwise false.
   */
  changePassword(userEmail, oldPassword, password1, password2) {
    const data = {
      email: userEmail,
      oldPassword,
      password1,
      password2,
    };

    return axios
      .put(this._getURL("auth/change-password"), data)
      .then(response => {
        return {
          success: true,
          data: response.data,
        };
      })
      .catch(err => {
        return {
          success: false,
          data: err.response.data,
        };
      });
  }

  /**
   * Send reset password email.
   *
   * @param {string} userEmail User email.
   * @param {string} passwordResetLinkPage Password reset link page.
   *
   * @return {Promise<*>} If the email was sent, otherwise false.
   */
  sendResetPasswordEmail(userEmail, passwordResetLinkPage) {
    const data = {
      email: userEmail,
      passwordResetLinkPage: passwordResetLinkPage,
    };

    return axios
      .put(this._getURL("auth/send-reset-password-email"), data)
      .then(response => {
        return {
          success: true,
          data: response.data,
        };
      })
      .catch(err => {
        return {
          success: false,
          data: err.response.data,
        };
      });
  }

  /**
   * Reset user's password.
   *
   * @param {string} userEmail User email.
   * @param {string} password1 New password.
   * @param {string} password2 Password confirmation.
   *
   * @return {Promise<*>} If password was changed returns true, otherwise false.
   */
  resetPassword(userEmail, token, password1, password2) {
    const data = {
      email: userEmail,
      token: token,
      password1: password1,
      password2: password2,
    };

    return axios
      .put(this._getURL("auth/reset-password"), data)
      .then(response => {
        return {
          success: true,
          data: response.data,
        };
      })
      .catch(err => {
        return {
          success: false,
          data: err.response.data,
        };
      });
  }

  /**
   * Change user name.
   *
   * @param {string} userEmail User email.
   * @param {string} username New user name.
   *
   * @return {Promise<*>} If username was changed returns true, otherwise false.
   */
  changeUsername(userEmail, username) {
    const data = {
      email: userEmail,
      username,
    };

    return axios
      .put(this._getURL("auth/change-username"), data)
      .then(response => {
        return {
          success: true,
          data: response.data,
        };
      })
      .catch(err => {
        return {
          success: false,
          data: err.response.data,
        };
      });
  }

  /**
   * Change user email.
   *
   * @param {string} userEmail User email.
   * @param {string} newEmail New user email.
   * @param {string} securityQuestionPageLink Link to security question page.
   *
   * @return {Promise<*>} If email was changed returns true, otherwise false.
   */
  changeEmail(userEmail, newEmail, securityQuestionPageLink) {
    const data = {
      email: userEmail,
      postValidationBaseLink: securityQuestionPageLink,
      newEmail,
    };

    return axios
      .put(this._getURL("auth/change-email"), data)
      .then(response => {
        return {
          success: true,
          data: response.data,
        };
      })
      .catch(err => {
        return {
          success: false,
          data: err.response.data,
        };
      });
  }

  /**
   * Validate reCAPTCHA token.
   *
   * @param {string} token recaptcha generated token.
   *
   * @return {Promise<*>}
   * @async
   */
  verifyCaptcha(token) {
    return axios
      .post(this._getURL("verify-captcha"), { token })
      .then(response => response.data);
  }

  /**
   * Unsubscribe email.
   *
   * @param {string} email Email to unsubscribe.
   *
   * @return {Promise<*>}
   * @async
   */
  unsubscribeUser(email) {
    return axios
      .post(this._getURL("unsubscribe"), { email })
      .then(response => response.data);
  }

  /**
   * Subscribe email.
   *
   * @param {string} email Email to subscribe.
   *
   * @return {Promise<*>}
   * @async
   */
  subscribeUser(email) {
    return axios
      .post(this._getURL("subscribe"), { email })
      .then(response => response.data);
  }
}

export default new PocketUserService();
