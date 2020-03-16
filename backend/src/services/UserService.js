import BaseService from "./BaseService";
import {get_auth_providers, getAuthProvider} from "../providers/auth";

const AUTH_TOKEN_TYPE = "access_token";

class UserService extends BaseService {

  constructor() {
    super();

    /** @type BaseAuthProvider[] */
    this.__authProviders = get_auth_providers();
  }

  /**
   * Retrieve User data from auth provider.
   *
   * @param {string} providerName Name of auth provider.
   * @param {string} code Code returned by auth provider.
   *
   * @return {Promise<AuthProviderUser>}
   * @private
   */
  async __getProviderUserData(providerName, code) {
    const authProvider = getAuthProvider(this.__authProviders, providerName);
    const accessToken = await authProvider.getToken(code, AUTH_TOKEN_TYPE);

    return authProvider.getUserData(accessToken, AUTH_TOKEN_TYPE);
  }

  async __signUp(user) {
    // TODO: Implement the method.
  }

  /**
   * Get consent provider auth urls.
   *
   * @return {{name:string, consent_url:string}[]}
   */
  getConsentProviderUrls() {
    return this.__authProviders.map(provider => {
      return {
        name: provider.name,
        consent_url: provider.getConsentURL()
      };
    });
  }

  /**
   * Authenticate User using an auth provider. If the user does not exist on our database it will create.
   *
   * @param {string} providerName Name of auth provider.
   * @param {string} code Code returned by auth provider.
   *
   * @return Promise<AuthProviderUser>
   */
  async authenticateWithAuthProvider(providerName, code) {
    // TODO: Looking in the database to update last login.
    // TODO: Implement sign up.

    return this.__getProviderUserData(providerName, code);
  }

  /**
   * Authenticate user with email and password.
   *
   * @param {string} username Username of user (in this case is the email).
   * @param {string} password Password of user to authenticate.
   *
   * @return {Promise<void>}
   */
  async authenticateUser(username, password) {
    // TODO: Implement the method.
  }

  async signUpUser(user) {
    // TODO: Implement the method.
  }

  /**
   * Logout user.
   *
   * @param {string} username Username of user (in this case is the email).
   *
   * @return {Promise<void>}
   */
  async logout(username) {
  }

}

export default UserService;

