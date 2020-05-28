import PocketBaseService from "./PocketBaseService";
import axios from "axios";

export const AUTH_PROVIDERS = {
  email: "email",
  github: "github",
  google: "google",
};

class PocketUserService extends PocketBaseService {

  constructor() {
    super("api/users");
  }

  /**
   * Save user data in local storage.
   *
   * @param {{username:string,email:string,provider:string}} user Pocket User to save.
   * @param {boolean} loggedIn If user is logged in.
   */
  saveUserInCache(user, loggedIn) {
    localStorage.setItem("is_logged_in", loggedIn.toString());
    localStorage.setItem("user_name", user.username);
    localStorage.setItem("user_email", user.email);
    localStorage.setItem("user_provider", user.provider);
  }


  /**
   * Save wether show message or not.
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
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_provider");

    localStorage.removeItem("is_logged_in");
  }

  /**
   * @return {boolean}
   */
  isLoggedIn() {
    return localStorage.hasOwnProperty("is_logged_in") && localStorage.getItem("is_logged_in") === "true";
  }

  /**
   * Get logged user information.
   *
   * @return {{provider: string, name: string, email: string}}
   */
  getUserInfo() {
    if (this.isLoggedIn()) {
      return {
        name: localStorage.getItem("user_name"),
        email: localStorage.getItem("user_email"),
        provider: localStorage.getItem("user_provider")
      };
    } else {
      return {
        name: "",
        email: "",
        provider: ""
      };
    }
  }

  /**
   * Validate a token.
   *
   * @param {string} token Token to validate.
   *
   * @return {Promise<*>}
   */
  validateToken(token) {
    return axios.post(this._getURL("validate-token"), {token})
      .then(response => response.data)
      .catch(err => {
        return {
          success: false,
          data: err
        };
      });
  }

  /**
   * Get available Auth Providers.
   *
   * @return {Promise|Promise<Array.<{name:string, consent_url:string}>>}
   */
  getAuthProviders() {
    return axios.get(this._getURL("auth/providers"))
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
      code
    };

    return axios.post(this._getURL("auth/provider/login"), data)
      .then(response => {
        if (response.status === 200) {
          this.saveUserInCache(response.data, true);

          return {
            success: true
          };
        }

        return {
          success: false
        };
      }).catch(err => {
        return {
          success: false,
          data: err
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
      password
    };

    return axios.post(this._getURL("auth/login"), data)
      .then(response => {
        if (response.status === 200) {
          this.saveUserInCache(response.data, true);

          return {
            success: true,
            data: response.data
          };
        }

        return {
          success: false
        };
      }).catch(err => {
        return {
          success: false,
          data: err
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
  async signUp(username, email, password1, password2, securityQuestionPageLink) {
    const data = {
      username,
      email,
      password1,
      password2,
      postValidationBaseLink: securityQuestionPageLink
    };

    return axios.post(this._getURL("auth/signup"), data)
      .then(response => {
        if (response.status === 200) {
          return {
            success: true
          };
        }

        return {
          success: false
        };
      }).catch(err => {
        return {
          success: false,
          data: err
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
      postValidationBaseLink: securityQuestionPageLink
    };

    return axios.post(this._getURL("auth/resend-signup-email"), data)
      .then(response => {
        return {
          success: response.data
        };
      }).catch(err => {
        return {
          success: false,
          data: err
        };
      });
  }

  logout() {
    const data = {
      email: this.getUserInfo().email,
    };

    axios.post(this._getURL("auth/logout"), data)
      .then(logoutResponse => {
        if (logoutResponse.status === 200 && logoutResponse.data) {
          this.removeUserFromCached();
        }
      });
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
      authProvider
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
      authProvider
    };

    return axios
      .post(this._getURL("auth/is-validated"), data)
      .then(response => response.data);
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
      .post(this._getURL("verify-captcha"), {token})
      .then(response => response.data);
  }

  /**
   * Format an email.
   *
   * @param {string} email Email to format.
   *
   * @return {string}
   */
  formatEmail(email) {
    const index = email.indexOf("@");
    const lastLetters = email.substring(index - 2, index);
    const emailProvider = email.substring(index);

    return `******${lastLetters}${emailProvider}`;
  }
}

export default new PocketUserService();
