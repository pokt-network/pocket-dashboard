import PocketBaseService from "./PocketBaseService";
import axios from "axios";

class PocketUserService extends PocketBaseService {

  constructor() {
    super("api/user");
  }

  /**
   * Save user data in local storage.
   *
   * @param {{id:*,name:string,email:string,avatar:string}} user Pocket User to save.
   * @param {boolean} loggedIn If user is logged in.
   */
  saveUserInCache(user, loggedIn) {
    localStorage.setItem("is_logged_in", loggedIn.toString());
    localStorage.setItem("user_id", user.id);
    localStorage.setItem("user_name", user.name);
    localStorage.setItem("user_email", user.email);
    localStorage.setItem("user_avatar", user.avatar);
  }

  /**
   * Remove user data from local storage.
   */
  removeUserFromCached() {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_entity_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_avatar");

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
   * @return {{}|{avatar: string, name: string, id: *, email: string}}
   */
  getUserInfo() {
    if (this.isLoggedIn()) {
      return {
        id: localStorage.getItem("user_id"),
        name: localStorage.getItem("user_name"),
        email: localStorage.getItem("user_email"),
        avatar: localStorage.getItem("user_avatar"),
      };
    } else {
      return {};
    }
  }


  getAuthProviders() {
    return axios.get(this._getURL("auth/providers"))
      .then(response => response.data);
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

  logout() {
    const data = {
      username: this.getUserInfo().email,
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
