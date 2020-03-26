export class ApplicationKeys {

  /**
   * @param {string} address Address of application in the network.
   * @param {string} publicKey Public key of application in the network.
   */
  constructor(address, publicKey) {
    Object.assign(this, {address, publicKey});
  }
}

export class ApplicationPoktAccount {

  /**
   * @param {string} address Address of application in the network.
   * @param {string} privateKey Private key of application.
   * TODO: Add passphrase
   */
  constructor(address, privateKey) {
    Object.assign(this, {address, privateKey});
  }
}

export class PocketApplication {

  /**
   * @param {string} name Name.
   * @param {string} owner Owner.
   * @param {string|URL} url URL.
   * @param {string} contactEmail A support contact email.
   * @param {string} user User that belong the application.
   */
  constructor(name, owner, url, contactEmail, user) {
    Object.assign(this, {name, owner, url, contactEmail, user});

    this.description = "";
    this.icon = "";
    this.applicationKeys = null;

    // TODO: Add type
    this.networkChains = [];
  }
}
