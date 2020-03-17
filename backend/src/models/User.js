export class PocketUser {

  /**
   * @param {string} provider Provider name.
   * @param {string} email Email of user.
   * @param {string} [username] Username of user.
   * @param {string} [password] Password.
   * @param {string} [lastLogin] Last login.
   */
  constructor(provider, email, username, password, lastLogin) {
    Object.assign(this, {provider: provider.toLowerCase(), email, username, password, lastLogin});
  }

  /**
   * Factory method to create an user object.
   *
   * @param {AuthProviderUser} user User to create.
   *
   * @return {PocketUser}
   */
  static createPocketUserFromAuthProviderUser(user) {
    return new PocketUser(user.provider, user.email);
  }

  /**
   * Factory method to create an user object.
   *
   * @param {PocketUser} user User to create.
   * @param {string} password Password of user.
   *
   * @return {PocketUser}
   */
  static createPocketUserWithEncryptedPassword(user, password) {
    /** @type string */
    const encryptedPassword = password;

    return new PocketUser(user.provider, user.email, user.username, encryptedPassword);
  }

  /**
   * Factory method to create an user object.
   *
   * @param {PocketUser} user User to create.
   *
   * @return {PocketUser}
   */
  static createPocketUserWithLastLogin(user) {
    const lastLoginUTC = new Date().toUTCString();

    return new PocketUser(user.provider, user.email, user.username, user.password, lastLoginUTC);
  }

}

export class AuthProviderUser extends PocketUser {

  /**
   * @param {string} provider Provider name.
   * @param {string} id ID of user.
   * @param {string} name Name of user.
   * @param {string} email Email of user.
   * @param {string} [avatarURL] Gravatar of user.
   */
  constructor(provider, id, name, email, avatarURL) {
    super(provider, email);
    this.id = id;
    this.name = name;
    this.avatarURL = avatarURL;
  }
}

export class GithubUser extends AuthProviderUser {


  constructor(id, name, email, avatarURL) {
    super("github", id, name, email, avatarURL);
  }
}

export class GoogleUser extends AuthProviderUser {

  constructor(id, name, email, avatarURL) {
    super("google", id, name, email, avatarURL);
  }
}

export class EmailUser extends PocketUser {

  constructor(id, name, email) {
    super("email", id, name, email);
  }
}

