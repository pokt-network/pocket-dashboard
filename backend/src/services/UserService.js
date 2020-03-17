import BaseService from "./BaseService";
import {get_auth_providers, getAuthProvider} from "../providers/auth";
import {PocketUser} from "../models/User";

const AUTH_TOKEN_TYPE = "access_token";
const USER_ENTITY_NAME = "Users";

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

  /**
   * Create user if not exists at Pocket database.
   *
   * @param {PocketUser} user User to create on database.
   *
   * @private
   */
  async __createUserIfNotExists(user) {
    const dbUser = await this._persistenceService.getEntityByFilter(USER_ENTITY_NAME, {email: user.email});

    if (!dbUser) {
      await this._persistenceService.saveEntity(USER_ENTITY_NAME, user);
    }
  }

  /**
   * Update last login of user.
   *
   * @param {PocketUser} user User to update last login.
   *
   * @private
   */
  async __updateLastLogin(user) {
    const userToUpdate = PocketUser.createPocketUserWithUTCLastLogin(user);

    await this._persistenceService.updateEntity(USER_ENTITY_NAME, {email: user.email}, userToUpdate);
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
   * @return {Promise<PocketUser>}
   */
  async authenticateWithAuthProvider(providerName, code) {
    const user = await this.__getProviderUserData(providerName, code);

    // Create the user if not exists on DB.
    const pocketUser = PocketUser.createPocketUserFromAuthProviderUser(user);
    await this.__createUserIfNotExists(pocketUser);

    // Update last login of user on DB.
    await this.__updateLastLogin(pocketUser);

    return user;
  }

  /**
   * Authenticate user with email and password.
   *
   * @param {string} username Username of user.
   * @param {string} password Password of user to authenticate.
   *
   * @return {Promise<PocketUser>}
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
   * @param {string} username Username of user.
   *
   * @return {Promise<void>}
   */
  async logout(username) {
  }

}

export default UserService;

