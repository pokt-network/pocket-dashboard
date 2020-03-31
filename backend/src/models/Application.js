import {Account} from "@pokt-network/pocket-js";
import PocketService from "../services/PocketService";
import {Configurations} from "../_configuration";
import {EMAIL_REGEX, URL_REGEX} from "./Regex";

export const ApplicationStatuses = {
  bounded: "bounded",
  unbounding: "unbounding",
  unbounded: "unbounded"
};

export class ApplicationPublicPocketAccount {

  /**
   * @param {string} address Address in Hex.
   * @param {string} publicKey Public key in Hex.
   */
  constructor(address, publicKey) {
    Object.assign(this, {address, publicKey});
  }

  /**
   * Convenient Factory method to create a application public pocket account.
   *
   * @param {Account} account Pocket account.
   *
   * @returns {ApplicationPublicPocketAccount} A new application public pocket account.
   * @static
   */
  static createApplicationPublicPocketAccount(account) {
    const publicKey = account.publicKey.toString("hex");

    return new ApplicationPublicPocketAccount(account.addressHex, publicKey);
  }
}

export class ApplicationPrivatePocketAccount {

  /**
   * @param {string} address Address in Hex.
   * @param {string} privateKey Unencrypted private key in Hex.
   */
  constructor(address, privateKey) {
    Object.assign(this, {address, privateKey});
  }

  /**
   * Convenient Factory method to create a application private pocket account.
   *
   * @param {PocketService} pocketService Pocket service used to get account.
   * @param {Account} account Pocket account.
   * @param {string} passPhrase Passphrase used to generate account.
   *
   * @returns {Promise<ApplicationPrivatePocketAccount>} A new application private pocket account.
   * @static
   * @async
   */
  static async createApplicationPrivatePocketAccount(pocketService, account, passPhrase) {
    const privateKey = await pocketService.exportRawAccount(account.addressHex, passPhrase);

    return Promise.resolve(new ApplicationPrivatePocketAccount(account.addressHex, privateKey));
  }
}

export class ApplicationNetworkInfo {

  /**
   * @param {number} balance Balance.
   * @param {number} stakePokt Stake Pokt.
   * @param {number} maxRelay Max Relay.
   * @param {boolean} jailed Jailed.
   * @param {string} status Status.
   */
  constructor(balance, stakePokt, maxRelay, jailed, status) {
    Object.assign(this, {balance, stakePokt, maxRelay, jailed, status});
  }

  /**
   * Convenient Factory method to create a application network information, when you create new application.
   *
   * @returns {ApplicationNetworkInfo} A new application network information.
   * @static
   */
  static createNetworkInfoToNewApplication() {
    return new ApplicationNetworkInfo(0, 0, Configurations.pocketNetwork.min_max_relay_per_app, false, ApplicationStatuses.unbounded);
  }
}

export class PocketApplication {

  /**
   * @param {string} name Name.
   * @param {string} owner Owner.
   * @param {string|URL} url URL.
   * @param {string} contactEmail A support contact email.
   * @param {string} user User that belong the application.
   * @param {string} [description] Description.
   * @param {string} [icon] Icon.
   */
  constructor(name, owner, url, contactEmail, user, description, icon) {
    Object.assign(this, {name, owner, url, contactEmail, user, description, icon});

    /** @type {ApplicationPublicPocketAccount} */
    this.publicPocketAccount = null;

    // TODO: Add type
    this.networkChains = [];
  }

  /**
   * Validate application data.
   *
   * @param {object} applicationData Application to create.
   * @param {string} applicationData.name Name.
   * @param {string} applicationData.owner Owner.
   * @param {string} applicationData.url URL.
   * @param {string} applicationData.contactEmail E-mail.
   * @param {string} applicationData.user User.
   * @param {string} [applicationData.description] Description.
   * @param {string} [applicationData.icon] Icon.
   *
   * @returns {boolean} If is validation success
   * @throws {Error} If validation fails
   * @static
   */
  static validate(applicationData) {

    if (applicationData.name === "") {
      throw Error("Name is not valid.");
    }

    if (applicationData.owner === "") {
      throw Error("Owner is not valid.");
    }

    if (!URL_REGEX.test(applicationData.url)) {
      throw Error("URL is not valid.");
    }

    if (!EMAIL_REGEX.test(applicationData.contactEmail)) {
      throw Error("Contact email address is not valid.");
    }

    if (!EMAIL_REGEX.test(applicationData.user)) {
      throw Error("User is not valid.");
    }

    return true;
  }

  /**
   * Convenient Factory method to create a Pocket application.
   *
   * @param {object} applicationData Application to create.
   * @param {string} applicationData.name Name.
   * @param {string} applicationData.owner Owner.
   * @param {string} applicationData.url URL.
   * @param {string} applicationData.contactEmail E-mail.
   * @param {string} applicationData.user User.
   * @param {string} [applicationData.description] Description.
   * @param {string} [applicationData.icon] Icon.
   *
   * @returns {PocketApplication} A new Pocket application.
   * @static
   */
  static createPocketApplication(applicationData) {
    const {name, owner, url, contactEmail, user, description, icon} = applicationData;

    return new PocketApplication(name, owner, url, contactEmail, user, description, icon);
  }
}

export class ExtendedPocketApplication {

  /**
   * @param {PocketApplication} pocketApplication Pocket application.
   * @param {string} status Status.
   * @param {bigint} stakedPokt StakedPokt.
   */
  constructor(pocketApplication, status, stakedPokt) {
    Object.assign(this, {pocketApplication, status, stakedPokt});
  }

  /**
   * Convenient Factory method to create an Extended Pocket application.
   *
   * @param {PocketApplication} pocketApplication Application data.
   * @param {string} status Status.
   * @param {bigint} stakedPokt Staked Pokt.
   *
   * @returns {ExtendedPocketApplication} A new Pocket application.
   * @static
   */
  static createExtendedPocketApplication(pocketApplication, status, stakedPokt) {
    return new ExtendedPocketApplication(pocketApplication, status, stakedPokt);
  }
}
