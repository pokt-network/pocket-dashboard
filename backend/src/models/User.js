export class AuthProviderUser {
  /**
   *
   * @param {string} provider Provider name.
   * @param {string} id ID of user.
   * @param {string} name Name of user.
   * @param {string} email Email of user.
   * @param {string} avatarURL Gravatar of user.
   */
  constructor(provider, id, name, email, avatarURL = undefined) {
    this.provider = provider.toLowerCase();
    this.id = id;
    this.name = name;
    this.email = email;
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

