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
   * Retrieve User data from auth provider.
   *
   * @param {string} providerName Name of auth provider.
   * @param {string} code Code returned by auth provider.
   *
   * @return {Promise<AuthProviderUser>}
   * @protected
   */
  async _getProviderUserData(providerName, code) {
    const authProvider = getAuthProvider(this.__authProviders, providerName);
    const accessToken = await authProvider.getToken(code, AUTH_TOKEN_TYPE);

    return authProvider.getUserData(accessToken, AUTH_TOKEN_TYPE);
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

    return this._getProviderUserData(providerName, code);
  }

  async authenticateUser(username, password) {
  }

}

export default UserService;

