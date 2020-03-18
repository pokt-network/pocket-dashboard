import bcrypt from "bcrypt";

// eslint-disable-next-line no-useless-escape
const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_MIN_LENGTH = 8;
const SALT_ROUNDS = 10;

export class PocketUser {

  /**
   * @param {string} provider Provider name.
   * @param {string} email Email of user.
   * @param {string} username Username of user.
   * @param {string} [password] Password.
   * @param {string} [lastLogin] Last login.
   */
  constructor(provider, email, username, password, lastLogin) {
    Object.assign(this, {provider: provider.toLowerCase(), email, username, password, lastLogin});
  }

  /**
   * Factory method to create an user object.
   *
   * @param {PocketUser} user User to create.
   *
   * @return {PocketUser}
   * @static
   */
  static createPocketUserWithUTCLastLogin(user) {
    const lastLoginUTC = new Date().toUTCString();

    return new PocketUser(user.provider, user.email, user.username, user.password, lastLoginUTC);
  }

  /**
   * Validate user data.
   *
   * @param {Object} userData User data to validate.
   * @param {string} userData.email Email of user.
   * @param {string} userData.username Username of user.
   * @param {string} userData.password1 Password of user.
   * @param {string} userData.password2 Password to validate against Password1.
   *
   * @return boolean
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
   *
   * @param email Email of user.
   * @param username Username of user.
   * @param password Password of user.
   */
  constructor(email, username, password) {
    super("email", email, username, password);
  }

  /**
   * Factory method to create an Email user with encrypted password.
   *
   * @param {string} email
   * @param {string} username
   * @param {string} password
   *
   * @return {Promise<PocketUser>}
   * @static
   * @async
   */
  static async createEmailUserWithEncryptedPassword(email, username, password) {
    const encryptedPassword = await EmailUser.encryptPassword(password);

    return new EmailUser(email, username, encryptedPassword);
  }

  /**
   * Factory method to encrypt a password.
   *
   * @param {string} password Password to encrypt.
   *
   * @return {Promise<string>}
   * @static
   * @async
   */
  static async encryptPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
}

