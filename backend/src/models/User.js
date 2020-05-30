import bcrypt from "bcrypt";
import {AnsweredSecurityQuestion} from "./SecurityQuestion";
import {EMAIL_REGEX} from "./Regex";

const PASSWORD_MIN_LENGTH = 8;
const SALT_ROUNDS = 10;

export class PocketUser {

  /**
   * @param {string} provider Provider name.
   * @param {string} email Email of user.
   * @param {string} username Username of user.
   * @param {string} [password] Password.
   * @param {string} [lastLogin] Last login.
   * @param {Array<AnsweredSecurityQuestion>} [securityQuestions] Answered security question of user.
   * @param {string} [customerID] Customer ID.
   */
  constructor(provider, email, username, password, lastLogin, securityQuestions, customerID) {
    Object.assign(this, {
      provider: provider.toLowerCase(),
      email,
      username,
      password,
      lastLogin,
      securityQuestions,
      customerID
    });
  }


  /**
   * Factory type to create an user object.
   *
   * @param {PocketUser} user User to create.
   *
   * @returns {PocketUser} A new Pocket user.
   * @static
   */
  static createPocketUserWithUTCLastLogin(user) {
    const lastLoginUTC = new Date().toUTCString();

    return new PocketUser(user.provider, user.email, user.username, user.password, lastLoginUTC);
  }


  /**
   * Factory type to create an user object from db.
   *
   * @param {object} user User from db.
   * @param {string} user.provider Provider.
   * @param {string} user.email Email.
   * @param {string} user.username User name.
   * @param {string} user.password Password.
   * @param {string} user.lastLogin Last login.
   * @param {Array<AnsweredSecurityQuestion>} user.securityQuestions Security questions.
   * @param {string} user.customerID Customer ID.
   *
   * @returns {PocketUser} A new Pocket user.
   * @static
   */
  static createPocketUserFromDB(user) {
    return new PocketUser(user.provider, user.email, user.username, user.password, user.lastLogin, user.securityQuestions, user.customerID);
  }

  /**
   * Remove sensitive fields from user.
   *
   * @param {PocketUser} pocketUser Pocket user to remove fields.
   *
   * @returns {PocketUser} A new Pocket user.
   * @static
   */
  static removeSensitiveFields(pocketUser) {
    return new PocketUser(pocketUser.provider, pocketUser.email, pocketUser.username);
  }
}

export class AuthProviderUser extends PocketUser {

  /**
   * @param {string} provider Provider name.
   * @param {string} email Email of user.
   * @param {string} name Name of user.
   */
  constructor(provider, email, name) {
    super(provider, email, name);
  }
}

export class GithubUser extends AuthProviderUser {

  constructor(email, name) {
    super("github", email, name);
  }
}

export class GoogleUser extends AuthProviderUser {

  constructor(email, name) {
    super("google", email, name);
  }
}

export class EmailUser extends PocketUser {

  /**
   * @param {string} email Email of user.
   * @param {string} username Username of user.
   * @param {string} password Password of user.
   */
  constructor(email, username, password) {
    super("email", email, username, password);
  }

  /**
   * Validate user data.
   *
   * @param {object} userData User data to validate.
   * @param {string} userData.email Email of user.
   * @param {string} userData.username Username of user.
   * @param {string} userData.password1 Password of user.
   * @param {string} userData.password2 Password to validate against Password1.
   *
   * @returns {boolean} If is validation success
   * @throws {Error} If validation fails
   * @static
   */
  static validate(userData) {

    if (!EMAIL_REGEX.test(userData.email)) {
      throw Error("Email address is not valid.");
    }

    // Validate if username has white spaces.
    if (/\s/.test(userData.username)) {
      throw Error("Username is not valid.");
    }

    if (userData.password1.length < PASSWORD_MIN_LENGTH || userData.password2.length < PASSWORD_MIN_LENGTH) {
      throw Error(`Passwords must have ${PASSWORD_MIN_LENGTH} characters at least.`);
    }

    if (userData.password1 !== userData.password2) {
      throw Error("Passwords does not match.");
    }

    return true;
  }


  /**
   * Factory method to create an Email user with encrypted password.
   *
   * @param {string} email Email.
   * @param {string} username Username.
   * @param {string} password Password.
   *
   * @returns {Promise<PocketUser>} A new Email user.
   * @static
   * @async
   */
  static async createEmailUserWithEncryptedPassword(email, username, password) {
    const encryptedPassword = await EmailUser.encryptPassword(password);

    return new EmailUser(email, username, encryptedPassword);
  }

  /**
   * Factory type to encrypt a password.
   *
   * @param {string} password Password to encrypt.
   *
   * @returns {Promise<string>} An encrypted password.
   * @static
   * @async
   */
  static async encryptPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }


  /**
   * Compare passwords.
   *
   * @param {string} plainPassword Password unencrypted.
   * @param {string} userPassword Encrypted user password.
   *
   * @returns {Promise<boolean>} If plainPassword matches against userPassword.
   * @static
   * @async
   */
  static async validatePassword(plainPassword, userPassword) {
    return await bcrypt.compare(plainPassword, userPassword);
  }
}

