import BaseService from "./BaseService";
import {get_auth_providers, getAuthProvider} from "../providers/auth/Index";
import {AuthProviderUser, EmailUser, PocketUser} from "../models/User";
import {AnsweredSecurityQuestion} from "../models/SecurityQuestion";
import BaseAuthProvider from "../providers/auth/BaseAuthProvider";

const AUTH_TOKEN_TYPE = "access_token";
const USER_COLLECTION_NAME = "Users";

export default class UserService extends BaseService {

  constructor() {
    super();

    /** @type {BaseAuthProvider[]} */
    this.__authProviders = get_auth_providers();
  }

  /**
   * Retrieve User data from Auth provider.
   *
   * @param {string} providerName Name of Auth provider.
   * @param {string} code Code returned by Auth provider.
   *
   * @returns {Promise<AuthProviderUser>} An Auth Provider user.
   * @private
   * @async
   */
  async __getProviderUserData(providerName, code) {
    const authProvider = getAuthProvider(this.__authProviders, providerName);
    const accessToken = await authProvider.getToken(code, AUTH_TOKEN_TYPE);

    return authProvider.getUserData(accessToken, AUTH_TOKEN_TYPE);
  }


  /**
   * Persist user if not exists at Pocket database.
   *
   * @param {PocketUser} user User to create on database.
   *
   * @returns {Promise<boolean>} If user was created or not.
   * @private
   * @async
   */
  async __persistUserIfNotExists(user) {

    if (!await this.userExists(user.email)) {
      /** @type {{result: {n:number, ok: number}}} */
      const result = await this.persistenceService.saveEntity(USER_COLLECTION_NAME, user);

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

    await this.persistenceService.updateEntity(USER_COLLECTION_NAME, {email: user.email}, userToUpdate);
  }

  /**
   * Check if user exists on DB.
   *
   * @param {string} userEmail User email to check if exists.
   *
   * @returns {Promise<boolean>} If user exists or not.
   * @async
   */
  async userExists(userEmail) {
    const filter = {email: userEmail};
    const dbUser = await this.persistenceService.getEntityByFilter(USER_COLLECTION_NAME, filter);

    return Promise.resolve(dbUser !== null);
  }

  /**
   * Get consent provider Auth urls.
   *
   * @returns {{name:string, consent_url:string}[]} The consent url for all Auth provider available.
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
   * Authenticate User using an Auth provider. If the user does not exist on our database it will create.
   *
   * @param {string} providerName Name of Auth provider.
   * @param {string} code Code returned by Auth provider.
   *
   * @returns {Promise<PocketUser>} an authenticated(via Auth provider) pocket user.
   * @async
   */
  async authenticateWithAuthProvider(providerName, code) {
    const user = await this.__getProviderUserData(providerName, code);

    // Create the user if not exists on DB.
    await this.__persistUserIfNotExists(user);

    // Update last login of user on DB.
    await this.__updateLastLogin(user);

    return user;
  }

  /**
   * Authenticate user with email or username and password.
   *
   * @param {string} username Email or username of user.
   * @param {string} password Password of user to authenticate.
   *
   * @returns {Promise<PocketUser>} An authenticated pocket user.
   * @throws {Error} If username or password is invalid.
   * @async
   */
  async authenticateUser(username, password) {
    const filter = {$or: [{username}, {email: username}]};
    const userDB = await this.persistenceService.getEntityByFilter(USER_COLLECTION_NAME, filter);

    if (!userDB) {
      throw Error("Invalid username.");
    }

    const pocketUser = PocketUser.createPocketUserFromDB(userDB);

    if (!pocketUser.password) {
      throw Error("Passwords do not match");
    }

    const passwordValidated = await EmailUser.validatePassword(password, pocketUser.password);

    if (!passwordValidated) {
      throw Error("Passwords do not match");
    }

    return PocketUser.removeSensitiveFields(pocketUser);
  }

  /**
   * Sign up a User.
   *
   * @param {object} userData User data to validate.
   * @param {string} userData.email Email of userData.
   * @param {string} userData.username Username of userData.
   * @param {string} userData.password1 Password of userData.
   * @param {string} userData.password2 Password to validate against Password1.
   *
   * @returns {Promise<boolean>} If user was created or not.
   * @throws {Error} If validation fails.
   * @async
   */
  async signupUser(userData) {
    if (EmailUser.validate(userData)) {
      const emailPocketUser = await EmailUser.createEmailUserWithEncryptedPassword(userData.email, userData.username, userData.password1);

      // Create the user if not exists on DB.
      const created = await this.__persistUserIfNotExists(emailPocketUser);

      return Promise.resolve(created);
    }
  }

  /**
   * Logout user.
   *
   * @param {string} email Email of user.
   *
   * @returns {Promise<boolean>} If user was logout or not.
   * @async
   */
  async logout(email) {
    return Promise.resolve(true);
  }

  /**
   * Add or update answered security questions to user.
   *
   * @param {string} userEmail Email of user.
   * @param {Array<{question: string, answer:string}>} questions Questions to add or update.
   *
   * @returns {Promise<boolean>} If user record was updated or not.
   */
  async addOrUpdateUserSecurityQuestions(userEmail, questions) {
    const filter = {email: userEmail};
    const userDB = await this.persistenceService.getEntityByFilter(USER_COLLECTION_NAME, filter);

    if (!userDB) {
      throw Error("Invalid user.");
    }

    const data = {securityQuestions: AnsweredSecurityQuestion.createAnsweredSecurityQuestions(questions)};
    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.updateEntity(USER_COLLECTION_NAME, filter, data);

    return Promise.resolve(result.result.ok === 1);
  }
}

