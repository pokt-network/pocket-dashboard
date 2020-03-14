import BaseService from "./BaseService";
import {get_auth_providers} from "../providers/auth";


const AUTH_TOKEN_TYPE = "access_token";

class UserService extends BaseService {

  constructor() {
    super();

    /** @type BaseAuthProvider[] */
    this.__authProviders = get_auth_providers();
  }


  /**
   * @param {string} name Name of Authentication provider.
   * @return {BaseAuthProvider}
   *
   * @private
   */
  __getAuthProvider(name) {
    return this.__authProviders.filter((provider) => provider.name === name.toLowerCase())[0];
  }

  /**
   * Retrieve User data from auth provider.
   *
   * @return Promise<AuthProviderUser>
   */
  async getProviderUserData(providerName, code) {
    const authProvider = this.__getAuthProvider(providerName);
    const accessToken = await authProvider.getToken(code, AUTH_TOKEN_TYPE);

    // TODO: Lookup information in database.
    return authProvider.getUserData(accessToken, AUTH_TOKEN_TYPE);
  }

  async authenticateUser(username, password) {
  }

}

export default UserService;

