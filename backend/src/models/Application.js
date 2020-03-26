import {PocketAAT} from "@pokt-network/aat-js";

export const ApplicationStatuses = {
  bounded: "bounded",
  unbounding: "unbounding",
  unbounded: "unbounded"
};

export class ApplicationKeys {

  /**
   * @param {string} address Address of application in the network.
   * @param {string} publicKey Public key of application in the network.
   * @param {PocketAAT} aat Application Authorization Tokens
   */
  constructor(address, publicKey, aat) {
    Object.assign(this, {address, publicKey, aat});
  }
}

export class ApplicationPoktAccount {

  /**
   * @param {string} address Address of application in the network.
   * @param {string} privateKey Private key of application.
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

    this.status = ApplicationStatuses.unbounded;
    this.description = "";
    this.icon = "";
    this.applicationKeys = null;

    this.jailed = false;

    // TODO: Add type
    this.networkChains = [];
  }
}
