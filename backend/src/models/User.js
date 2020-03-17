export class PocketUser {

  /**
   * @param {string} provider Provider name.
   * @param {string} email Email of user.
   * @param {string} [avatar] Avatar of user.
   * @param {string} [username] Username of user.
   * @param {string} [password] Password.
   * @param {string} [lastLogin] Last login.
   */
  constructor(provider, email, avatar, username, password, lastLogin) {
    // TODO: remove avatar
    Object.assign(this, {provider: provider.toLowerCase(), email, avatar, username, password, lastLogin});
  }

  /**
   * Factory method to create an user object.
   *
   * @param {AuthProviderUser} user User to create.
   *
   * @return {PocketUser}
   */
  static createPocketUserFromAuthProviderUser(user) {
    // TODO: save name as username
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

    return new PocketUser(user.provider, user.email, user.avatar, user.username, encryptedPassword);
  }

  /**
   * Factory method to create an user object.
   *
   * @param {PocketUser} user User to create.
   *
   * @return {PocketUser}
   */
  static createPocketUserWithUTCLastLogin(user) {
    const lastLoginUTC = new Date().toUTCString();

    return new PocketUser(user.provider, user.email, user.avatar, user.username, user.password, lastLoginUTC);
  }

}

export class AuthProviderUser extends PocketUser {

  /**
   * @param {string} provider Provider name.
   * @param {string} id ID of user.
   * @param {string} name Name of user.
   * @param {string} email Email of user.
   * @param {string} [avatar] Avatar of user.
   */
  constructor(provider, id, name, email, avatar) {
    // TODO: remove avatar
    super(provider, email, avatar);
    this.id = id;
    this.name = name;
  }
}

export class GithubUser extends AuthProviderUser {


  constructor(id, name, email, avatarURL) {
    // TODO: remove avatar
    super("github", id, name, email, avatarURL);
  }
}

export class GoogleUser extends AuthProviderUser {

  constructor(id, name, email, avatarURL) {
    // TODO: remove avatar
    super("google", id, name, email, avatarURL);
  }
}

export class EmailUser extends PocketUser {

  constructor(id, name, email) {
    // TODO: save name as username
    super("email", id, name, email);
  }
}

