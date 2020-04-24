import {Account, Application, ApplicationParams, StakingStatus} from "@pokt-network/pocket-js";
import {PublicPocketAccount} from "./Account";
import {EMAIL_REGEX, URL_REGEX} from "./Regex";
import {Configurations} from "../_configuration";


export class PocketApplication {

  /**
   * @param {string} name Name.
   * @param {string} owner Owner.
   * @param {string|URL} url URL.
   * @param {string} contactEmail A support contact email.
   * @param {string} user User that belong the application.
   * @param {string} [description] Description.
   * @param {string} [icon] Icon.
   * @param {boolean} [freeTier] If is on free tier or not.
   */
  constructor(name, owner, url, contactEmail, user, description, icon, freeTier) {
    Object.assign(this, {name, owner, url, contactEmail, user, description, icon});

    /** @type {PublicPocketAccount} */
    this.publicPocketAccount = null;

    this.freeTier = freeTier || false;
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
   * @param {boolean} [applicationData.freeTier] Free tier status.
   * @param {PublicPocketAccount} [applicationData.publicPocketAccount] Public account data.
   *
   * @returns {PocketApplication} A new Pocket application.
   * @static
   */
  static createPocketApplication(applicationData) {
    const {name, owner, url, contactEmail, user, description, icon, publicPocketAccount, freeTier} = applicationData;
    const pocketApplication = new PocketApplication(name, owner, url, contactEmail, user, description, icon, freeTier);

    pocketApplication.publicPocketAccount = publicPocketAccount;

    return pocketApplication;
  }
}

export class ExtendedPocketApplication {

  /**
   * @param {PocketApplication} pocketApplication Pocket application.
   * @param {Application} networkData Application data from Pocket Network.
   */
  constructor(pocketApplication, networkData) {
    Object.assign(this, {pocketApplication, networkData});
  }

  /**
   * Convenient Factory method to create an extended pocket application.
   *
   * @param {PocketApplication} pocketApplication Application data.
   * @param {Application} applicationData Application data from Pocket Network.
   *
   * @returns {ExtendedPocketApplication} A new Pocket application.
   * @static
   */
  static createExtendedPocketApplication(pocketApplication, applicationData) {
    return new ExtendedPocketApplication(pocketApplication, applicationData);
  }

  /**
   * Convenient Factory method to create network application.
   *
   * @param {PublicPocketAccount} publicPocketAccount Public pocket account.
   * @param {string[]} chainHashes Network chain hashes.
   * @param {ApplicationParams} applicationParameters Application parameter from network.
   *
   * @returns {Application} Application.
   * @static
   */
  static createNetworkApplication(publicPocketAccount, chainHashes, applicationParameters) {
    const {address, publicKey} = publicPocketAccount;

    return new Application(address, publicKey, false, StakingStatus.Unstaked, chainHashes, 0n, applicationParameters.baseRelaysPerPokt, applicationParameters.unstakingTime);
  }

  /**
   * Convenient Factory method to create network application as free tier.
   *
   * @param {Account} freeTierAccount Free tier account.
   * @param {string[]} chainHashes Network chain hashes.
   * @param {ApplicationParams} applicationParameters Application parameter from network.
   *
   * @returns {Application} Application.
   * @static
   */
  static createNetworkApplicationAsFreeTier(freeTierAccount, chainHashes, applicationParameters) {
    const publicKey = freeTierAccount.publicKey.toString("hex");

    return new Application(freeTierAccount.addressHex, publicKey, false, StakingStatus.Staked, chainHashes, Configurations.pocket_network.free_tier.stake_amount, applicationParameters.baseRelaysPerPokt, applicationParameters.unstakingTime);
  }
}

export class StakedApplicationSummary {

  /**
   * @param {string} totalApplications Total of Applications.
   * @param {string} averageStaked Average of staked applications.
   * @param {string} averageRelays Average of relays.
   */
  constructor(totalApplications, averageStaked, averageRelays) {
    Object.assign(this, {totalApplications, averageStaked, averageRelays});
  }
}
