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
   * @return Promise<AuthProviderUser>
   */
  async getProviderUserData(providerName, code) {
    const authProvider = getAuthProvider(this.__authProviders, providerName);
    const accessToken = await authProvider.getToken(code, AUTH_TOKEN_TYPE);

    // TODO: Lookup information in database.
    return authProvider.getUserData(accessToken, AUTH_TOKEN_TYPE);
  }

  async authenticateUser(username, password) {
  }

}

export default UserService;

