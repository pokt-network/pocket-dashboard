import {Account, Application, ApplicationParams, StakingStatus} from "@pokt-network/pocket-js";
import PocketService from "../services/PocketService";
import {EMAIL_REGEX, URL_REGEX} from "./Regex";
import {Chains} from "../providers/NetworkChains";


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

export class PocketApplication {

  /**
   * @param {string} name Name.
   * @param {string} owner Owner.
   * @param {string|URL} url URL.
   * @param {string} contactEmail A support contact email.
   * @param {string} user User that belong the application.
   * @param {string} [description] Description.
   * @param {string} [icon] Icon.
   * @param {boolean} [freeTier] Wether is on free tier or not.
   */
  constructor(name, owner, url, contactEmail, user, description, icon, freeTier) {
    Object.assign(this, {name, owner, url, contactEmail, user, description, icon});

    /** @type {ApplicationPublicPocketAccount} */
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
   * @param {ApplicationPublicPocketAccount} [applicationData.publicPocketAccount] Public account data.
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
   * @param {ApplicationPublicPocketAccount} publicPocketAccount Public pocket account.
   * @param {ApplicationParams} applicationParameters Application parameter from network.
   *
   * @returns {Application} Application.
   * @static
   */
  static createNetworkApplication(publicPocketAccount, applicationParameters) {
    const {address, publicKey} = publicPocketAccount;
    const chainHashes = Chains.map(chain => chain.hash);

    return new Application(address, publicKey, false, StakingStatus.Unstaked, chainHashes, 0n, applicationParameters.baseRelaysPerPokt, applicationParameters.unstakingTime);
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
