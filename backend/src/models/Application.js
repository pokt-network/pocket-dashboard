import {Application, ApplicationParams, StakingStatus} from "@pokt-network/pocket-js";
import {PrivatePocketAccount, PublicPocketAccount} from "./Account";
import {EMAIL_REGEX, URL_REGEX} from "./Regex";
import {DashboardValidationError} from "./Exceptions";

export class RegisteredPocketApplication {
  /**
   * @param {string} name Name.
   * @param {string} address Address.
   * @param {StakingStatus} status Status
   */
  constructor(name, address, status) {
    Object.assign(this, {name, address, status});
  }
}

export class UserPocketApplication {
  /**
   * @param {string} id ID.
   * @param {string} name Name.
   * @param {string} address Address.
   * @param {string} icon Icon.
   * @param {string} stakedPOKT staked POKT.
   * @param {number} status Status.
   */
  constructor(id, name, address, icon, stakedPOKT, status) {
    Object.assign(this, {id, name, address, icon, stakedPOKT, status});
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
   * @param {boolean} [freeTier] If is on free tier or not.
   * @param {string} freeTierAppAddress Internal application address for free tier accounts.
   * @param {object} freeTierPrivateApp Internal private app object.
   */
  constructor(name, owner, url, contactEmail, user, description, icon, freeTier, freeTierAppAddress, freeTierPrivateApp) {
    Object.assign(this, {name, owner, url, contactEmail, user, description, icon});

    this.id = "";
    this.publicPocketAccount = new PublicPocketAccount("", "");
    this.freeTier = freeTier || false;
    if (freeTierPrivateApp) {
      this.freeTierApplicationAccount = new PrivatePocketAccount(freeTierPrivateApp.address, freeTierPrivateApp.publicKey, freeTierPrivateApp.privateKey);
    } else {
      this.freeTierApplicationAccount = new PrivatePocketAccount(freeTierAppAddress, "", "");
    }
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
   * @throws {DashboardValidationError} If validation fails
   * @static
   */
  static validate(applicationData) {

    if (applicationData.name === "") {
      throw new DashboardValidationError("Name is not valid.");
    }

    if (applicationData.name.length > 20) {
      throw new DashboardValidationError("Name length should not be greater than 20 character.");
    }

    if (applicationData.description !== "" && applicationData.description.length > 150) {
      throw new DashboardValidationError("Description length should not be greater than 150 character.");
    }

    if (applicationData.owner === "") {
      throw new DashboardValidationError("Owner is not valid.");
    }

    if (applicationData.url && !URL_REGEX.test(applicationData.url)) {
      throw new DashboardValidationError("URL is not valid.");
    }

    if (!EMAIL_REGEX.test(applicationData.contactEmail)) {
      throw new DashboardValidationError("Contact email address is not valid.");
    }

    if (!EMAIL_REGEX.test(applicationData.user)) {
      throw new DashboardValidationError("User is not valid.");
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
   * @param {string} [applicationData._id] Application ID.
   *
   * @returns {PocketApplication} A new Pocket application.
   * @static
   */
  static createPocketApplication(applicationData){
    const {name, owner, url, contactEmail, user, description, icon, publicPocketAccount, freeTier} = applicationData;
    let {freeTierApplicationAccount} = applicationData;

    if (freeTierApplicationAccount === undefined){
      freeTierApplicationAccount = {address: ""};
    }

    const pocketApplication = new PocketApplication(name, owner, url, contactEmail, user, description, icon, freeTier, freeTierApplicationAccount.address, undefined);

    pocketApplication.id = applicationData._id ?? "";
    pocketApplication.publicPocketAccount = publicPocketAccount ?? new PublicPocketAccount("", "");

    return pocketApplication;
  }

  /**
   * Convenient Factory method to create a Pocket Private application.
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
   * @param {string} [applicationData._id] Application ID.
   *
   * @returns {PocketApplication} A new Pocket application.
   * @static
   */
  static createPocketPrivateApplication(applicationData) {
    const {name, owner, url, contactEmail, user, description, icon, publicPocketAccount, freeTier, freeTierApplicationAccount} = applicationData;
    const pocketApplication = new PocketApplication(name, owner, url, contactEmail, user, description, icon, freeTier, freeTierApplicationAccount.address, freeTierApplicationAccount);

    pocketApplication.id = applicationData._id ?? "";
    pocketApplication.publicPocketAccount = publicPocketAccount ?? new PublicPocketAccount("", "");

    return pocketApplication;
  }

  /**
   * Convenient Factory method to create a registered pocket application.
   *
   * @param {object} applicationData Application to create.
   * @param {string} applicationData.address Address.
   * @param {StakingStatus} applicationData.status Status.
   * @param {string} [applicationData.name] Name.
   *
   * @returns {RegisteredPocketApplication} A new resumed pocket application.
   * @static
   */
  static createRegisteredPocketApplication(applicationData) {
    const appName = applicationData.name ?? "N/A";

    return new RegisteredPocketApplication(appName, applicationData.address, applicationData.status);
  }

  /**
   * Convenient Factory method to create an user pocket application.
   *
   * @param {object} applicationData Application to create.
   * @param {string} applicationData.id ID.
   * @param {string} applicationData.name Name.
   * @param {string} applicationData.address Address.
   * @param {string} applicationData.icon Icon.
   * @param {Application[]} networkApplications Applications.
   *
   * @returns {UserPocketApplication} A new user pocket application.
   * @static
   */
  static createUserPocketApplication(applicationData, networkApplications) {
    const {id, name, address, icon} = applicationData;
    let networkApp = networkApplications.filter(app => app.address === applicationData.address);

    if (networkApp.length > 0) {
      networkApp = networkApp[0];

      return new UserPocketApplication(id, name, address, icon, networkApp.stakedTokens.toString(), networkApp.status);
    }

    return new UserPocketApplication(id, name, address, icon, "0", 0);
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
   * @param {ApplicationParams} applicationParameters Application parameter from network.
   *
   * @returns {{address:string, publicKey:string, jailed:boolean, status: string, chains:string[], staked_tokens: string, max_relays: string, unstaking_time?: string}} Application.
   * @static
   */
  static createNetworkApplication(publicPocketAccount, applicationParameters) {
    const {address, publicKey} = publicPocketAccount;

    return {
      address,
      publicKey,
      jailed: false,
      status: "0",
      chains: [],
      staked_tokens: "0",
      max_relays: "0",
      unstaking_time: applicationParameters.unstakingTime.toString()
    };
  }
}

export class StakedApplicationSummary {

  /**
   * @param {string} totalApplications Total of Applications.
   * @param {string} averageStaked Average of staked applications.
   * @param {string} totalStaked Total staked applications.
   */
  constructor(totalApplications, averageStaked, totalStaked) {
    Object.assign(this, {totalApplications, averageStaked, totalStaked});
  }
}
