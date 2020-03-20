import PocketBaseService from "./PocketBaseService";
import axios from "axios";

class PocketUserService extends PocketBaseService {

  constructor() {
    super("api/user");
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
   * @return {{}|{provider: string, name: string, email: string}}
   */
  getUserInfo() {
    if (this.isLoggedIn()) {
      return {
        name: localStorage.getItem("user_name"),
        email: localStorage.getItem("user_email"),
        provider: localStorage.getItem("user_provider")
      };
    } else {
      return {};
    }
  }

  /**
   * Get available auth providers.
   *
   * @return {Promise|Promise<Array.<{name:string, consent_url:string}>>}
   */
  getAuthProviders() {
    return axios.get(this._getURL("auth/providers"))
      .then(response => response.data);
  }

  /**
   * @param {Array.<{name:string, consent_url:string}>} authProviders Name of auth provider.
   * @param {string} name Name of auth provider.
   *
   * @return {{name: string, consent_url:string}}
   */
  getAuthProvider(authProviders, name) {
    return authProviders.filter(
      value => value.name.toLowerCase() === name.toLowerCase()
    )[0];
  }


  /**
   * Login using an auth provider.
   *
   * @param {string} providerName Name of auth provider.
   * @param {string} code Code returned by auth provider.
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

          return {success: true};
        }

        return {success: false};
      }).catch(err => {
        return {success: false, data: err};
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

          return {success: true};
        }

        return {success: false};
      }).catch(err => {
        return {success: false, data: err};
      });
  }

    /**
   * Register new user.
   *
   * @param {string} username Username of user to login.
   * @param {string} email Wmail of user.
   * @param {string} password1 Password of user.
   * @param {string} password2 Repeated password of user.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   * @async
   */
  async signUp(username, email, password1, password2) {
    const data = {
      username,
      email,
      password1,
      password2
    };

    return axios.post(this._getURL("auth/signup"), data)
      .then(response => {
        if (response.status === 200) {
          return {success: true};
        }

        return {success: false};
      }).catch(err => {
        return {success: false, data: err};
      });
  }

  logout() {
    const data = {
      email: this.getUserInfo().email,
    };

    this.post(this._getURL("auth/logout"), data)
      .then(logoutResponse => {
        if (logoutResponse.status === 200 && logoutResponse.data) {
          this.removeUserFromCached();
        }
      });
  }

}

export default new PocketUserService();
