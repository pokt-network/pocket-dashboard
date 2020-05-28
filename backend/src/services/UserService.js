import BaseService from "./BaseService";
import {get_auth_providers, getAuthProvider} from "../providers/auth/Index";
import {AuthProviderUser, EmailUser, PocketUser} from "../models/User";
import {AnsweredSecurityQuestion} from "../models/SecurityQuestion";
import BaseAuthProvider from "../providers/auth/BaseAuthProvider";
import {Configurations} from "../_configuration";
import jwt from "jsonwebtoken";
import axios from "axios";

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

      return result.result.ok === 1;
    }
    return false;
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
   * @param {string} [authProvider] User auth provider type.
   *
   * @returns {Promise<boolean>} If user exists or not.
   * @async
   */
  async userExists(userEmail, authProvider = undefined) {
    let filter = {email: userEmail};

    if (authProvider) {
      filter["provider"] = authProvider;
    }

    const dbUser = await this.persistenceService.getEntityByFilter(USER_COLLECTION_NAME, filter);

    return dbUser !== undefined;
  }

  /**
   * Get User from DB.
   *
   * @param {string} email User email.
   *
   * @returns {Promise<PocketUser>} Pocket user.
   * @async
   */
  async getUser(email) {
    const filter = {email};
    const dbUser = await this.persistenceService.getEntityByFilter(USER_COLLECTION_NAME, filter);

    return PocketUser.createPocketUserFromDB(dbUser);
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

    // Update last login of user on DB.
    await this.__updateLastLogin(pocketUser);

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
   * @throws {Error} If validation fails or already exists.
   * @async
   */
  async signupUser(userData) {
    if (EmailUser.validate(userData)) {
      if (await this.userExists(userData.email)) {
        throw Error("This email is already registered");
      }

      const emailPocketUser = await EmailUser.createEmailUserWithEncryptedPassword(userData.email, userData.username, userData.password1);

      // Create the user if not exists on DB.
      return await this.__persistUserIfNotExists(emailPocketUser);
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
    return true;
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

    return result.result.ok === 1;
  }

  /**
   * Generate token encapsulating the user email.
   *
   * @param {string} userEmail User email to encapsulate.
   *
   * @returns {Promise<string>} The token generated.
   * @async
   */
  async generateToken(userEmail) {
    const payload = {email: userEmail};

    return jwt.sign(payload, Configurations.auth.jwt.secret_key);
  }

  /**
   * Decode a token.
   *
   * @param {string} token Token to decode.
   *
   * @returns {Promise<*>} The token payload.
   * @async
   */
  decodeToken(token) {
    return jwt.verify(token, Configurations.auth.jwt.secret_key);
  }

  /**
   * Validate reCAPTCHA token
   *
   * @param {string} token Token to validate.
   *
   * @returns {Promise<*>} recaptcha result.
   * @async
   */
  async verifyCaptcha(token) {
    const secret = Configurations.recaptcha.google_server;

    /**
     * Although is a POST request, google requires the data to be sent by query
     * params, trying to do so in the body will result on an error.
     */
    return await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`
    );
  }
}

