import BaseService from "./BaseService";
import {get_auth_providers, getAuthProvider} from "../providers/auth";
import {EmailUser, PocketUser} from "../models/User";

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
   * @async
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
   * @return {Promise<boolean>}
   * @private
   * @async
   */
  async __createUserIfNotExists(user) {
    const dbUser = await this._persistenceService.getEntityByFilter(USER_ENTITY_NAME, {email: user.email});

    if (!dbUser) {
      /** @type {{result: {n:number, ok: number}}} */
      const result = await this._persistenceService.saveEntity(USER_ENTITY_NAME, user);

      return Promise.resolve(result.result.ok === 1);
    }
    return Promise.resolve(false);
  }

  /**
   * Update last login of user.
   *
   * @param {PocketUser} user User to update last login.
   *
   * @private
   * @async
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
   * @async
   */
  async authenticateWithAuthProvider(providerName, code) {
    const user = await this.__getProviderUserData(providerName, code);

    // Create the user if not exists on DB.
    const created = await this.__createUserIfNotExists(user);

    if (created) {
      // Update last login of user on DB.
      await this.__updateLastLogin(user);
    }

    return user;
  }

  /**
   * Authenticate user with email or username and password.
   *
   * @param {string} username Email or username of user.
   * @param {string} password Password of user to authenticate.
   *
   * @return {Promise<PocketUser>}
   * @async
   */
  async authenticateUser(username, password) {
    // TODO: Implement the method.
  }

  /**
   * Sign up a User.
   *
   * @param {Object} userData User data to validate.
   * @param {string} userData.email Email of userData.
   * @param {string} userData.username Username of userData.
   * @param {string} userData.password1 Password of userData.
   * @param {string} userData.password2 Password to validate against Password1.
   *
   * @return {Promise<boolean>}
   * @throws {Error} If validation fails
   * @async
   */
  async signUpUser(userData) {
    if (PocketUser.validate(userData)) {
      const emailPocketUser = await EmailUser.createEmailUserWithEncryptedPassword(userData.email, userData.username, userData.password1);

      // Create the user if not exists on DB.
      const created = await this.__createUserIfNotExists(emailPocketUser);

      return Promise.resolve(created);
    }
  }

  /**
   * Logout user.
   *
   * @param {string} email Email of user.
   *
   * @return {Promise<boolean>}
   * @async
   */
  async logout(email) {
    return Promise.resolve(true);
  }

}

export default UserService;

