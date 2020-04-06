import BaseService from "./BaseService";
import {
  ApplicationPrivatePocketAccount,
  ApplicationPublicPocketAccount,
  ExtendedPocketApplication,
  PocketApplication,
  StakedApplicationSummary
} from "../models/Application";
import PocketAAT from "@pokt-network/aat-js";
import {Account, Application, StakingStatus} from "@pokt-network/pocket-js";
import UserService from "./UserService";
import bcrypt from "bcrypt";
import bigInt from "big-integer";
import {Configurations} from "../_configuration";

const APPLICATION_COLLECTION_NAME = "Applications";

export default class ApplicationService extends BaseService {


  constructor() {
    super();

    this.userService = new UserService();
  }

  /**
   * Generate a random passphrase.
   *
   * @param {PocketApplication} application Application.
   *
   * @returns {string} A passphrase.
   * @private
   * @async
   */
  async __generatePassphrase(application) {
    const seed = 10;

    const now = new Date();
    const data = `${application.name} + ${now.toUTCString()}`;

    return await bcrypt.hash(data, seed);
  }

  /**
   * Persist application on db if not exists.
   *
   * @param {PocketApplication} application Application to persist.
   *
   * @returns {Promise<boolean>} If application was persisted or not.
   * @private
   * @async
   */
  async __persistApplicationIfNotExists(application) {

    if (!await this.applicationExists(application)) {
      /** @type {{result: {n:number, ok: number}}} */
      const result = await this.persistenceService.saveEntity(APPLICATION_COLLECTION_NAME, application);

      return result.result.ok === 1;
    }

    return false;
  }

  /**
   * Create a pocket account in the network.
   *
   * @param {string} passPhrase Passphrase used to create pocket account.
   *
   * @returns {Promise<Account> | Error} A Pocket account created successfully.
   * @throws {Error} If creation of account fails.
   * @private
   */
  async __createPocketAccount(passPhrase) {
    const account = await this.pocketService.createAccount(passPhrase);

    if (account instanceof Error) {
      throw account;
    }

    return account;
  }

  /**
   *
   * @param {PocketApplication} application Application to add pocket data.
   *
   * @returns {Promise<ExtendedPocketApplication>} Pocket application with pocket data.
   * @private
   * @async
   */
  async __getExtendedPocketApplication(application) {
    /** @type {Application} */
    let networkApplication;

    try {
      networkApplication = await this.pocketService.getApplication(application.publicPocketAccount.address);
    } catch (e) {
      const appParameters = await this.pocketService.getApplicationParameters();

      networkApplication = ExtendedPocketApplication.createNetworkApplication(application.publicPocketAccount, appParameters);
    }

    return ExtendedPocketApplication.createExtendedPocketApplication(application, networkApplication);
  }

  /**
   *
   * @param {PocketApplication[]} applications Applications to add pocket data.
   *
   * @returns {Promise<ExtendedPocketApplication[]>} Pocket applications with pocket data.
   * @private
   * @async
   */
  async __getExtendedPocketApplications(applications) {
    const extendedApplications = applications.map(async (application) => this.__getExtendedPocketApplication(application));

    return Promise.all(extendedApplications);
  }

  /**
   * Mark application as Free tier.
   *
   * @param {PocketApplication} application Pocket application to mark as free tier.
   * @private
   */
  async __markApplicationAsFreeTier(application) {
    const filter = {
      "publicPocketAccount.address": application.publicPocketAccount.address
    };

    application.freeTier = true;
    await this.persistenceService.updateEntity(APPLICATION_COLLECTION_NAME, filter, application);
  }

  /**
   * Get an AAT of the application.
   *
   * @param {Account} clientAccount Client account to create AAT.
   * @param {Account} applicationAccount Application account to create AAT.
   * @param {string} applicationPassphrase Application passphrase.
   *
   * @returns {PocketAAT} Application AAT.
   */
  async __getAAT(clientAccount, applicationAccount, applicationPassphrase) {
    return this.pocketService.getApplicationAuthenticationToken(clientAccount, applicationAccount, applicationPassphrase);
  }

  /**
   * Check if application exists on DB.
   *
   * @param {PocketApplication} application Application to check if exists.
   *
   * @returns {Promise<boolean>} If application exists or not.
   * @async
   */
  async applicationExists(application) {
    const filter = {name: application.name, owner: application.owner};
    const dbApplication = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    return dbApplication !== undefined;
  }

  /**
   * Get application data.
   *
   * @param {string} applicationAddress Application address.
   *
   * @returns {Promise<ExtendedPocketApplication>} Application data.
   * @async
   */
  async getApplication(applicationAddress) {
    const filter = {
      "publicPocketAccount.address": applicationAddress
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (applicationDB) {
      const application = PocketApplication.createPocketApplication(applicationDB);

      return this.__getExtendedPocketApplication(application);
    }

    return null;
  }

  /**
   * Get all applications on network.
   *
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @returns {ExtendedPocketApplication[]} List of applications.
   * @async
   */
  async getAllApplications(limit, offset = 0) {
    const applications = (await this.persistenceService.getEntities(APPLICATION_COLLECTION_NAME, {}, limit, offset))
      .map(PocketApplication.createPocketApplication);

    if (applications) {
      return this.__getExtendedPocketApplications(applications);
    }

    return [];
  }

  /**
   * Get all applications on network that belongs to user.
   *
   * @param {string} userEmail Email of user.
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @returns {Promise<ExtendedPocketApplication[]>} List of applications.
   * @async
   */
  async getUserApplications(userEmail, limit, offset = 0) {
    const filter = {user: userEmail};
    /** @type {PocketApplication[]} */
    const applications = (await this.persistenceService.getEntities(APPLICATION_COLLECTION_NAME, filter, limit, offset))
      .map(PocketApplication.createPocketApplication);

    return this.__getExtendedPocketApplications(applications);
  }

  /**
   * Create an application on network.
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
   * @returns {Promise<{privateApplicationData: ApplicationPrivatePocketAccount, networkData:Application}| boolean>} An application information or false if not.
   * @throws {Error} If validation fails or already exists.
   * @async
   */
  async createApplication(applicationData) {
    if (PocketApplication.validate(applicationData)) {
      if (!await this.userService.userExists(applicationData.user)) {
        throw new Error("User does not exist");
      }

      const application = PocketApplication.createPocketApplication(applicationData);

      if (await this.applicationExists(application)) {
        throw new Error("Application already exists");
      }

      // Generate Pocket account for application.
      const passPhrase = await this.__generatePassphrase(application);
      const pocketAccount = await this.__createPocketAccount(passPhrase);

      application.publicPocketAccount = ApplicationPublicPocketAccount.createApplicationPublicPocketAccount(pocketAccount);

      const created = await this.__persistApplicationIfNotExists(application);

      if (created) {
        const appParameters = await this.pocketService.getApplicationParameters();

        const privateApplicationData = await ApplicationPrivatePocketAccount.createApplicationPrivatePocketAccount(this.pocketService, pocketAccount, passPhrase);
        const networkData = ExtendedPocketApplication.createNetworkApplication(application.publicPocketAccount, appParameters);

        return {privateApplicationData, networkData};
      }

      return false;
    }
  }

  /**
   * Get staked application summary.
   *
   * @returns {Promise<StakedApplicationSummary>} Summary data of staked applications.
   * @async
   */
  async getStakedApplicationSummary() {
    try {
      /** @type {Application[]} */
      const stakedApplications = await this.pocketService.getApplications(StakingStatus.Staked);

      // noinspection JSValidateTypes
      const totalApplications = bigInt(stakedApplications.length);

      // noinspection JSValidateTypes
      /** @type {bigint} */
      const totalStaked = stakedApplications.reduce((acc, appA) => bigInt(appA.stakedTokens).add(acc), 0n);

      // noinspection JSValidateTypes
      /** @type {bigint} */
      const totalRelays = stakedApplications.reduce((acc, appA) => bigInt(appA.maxRelays).add(acc), 0n);

      // noinspection JSUnresolvedFunction
      const averageStaked = totalStaked.divide(totalApplications);
      // noinspection JSUnresolvedFunction
      const averageMaxRelays = totalRelays.divide(totalApplications);

      return new StakedApplicationSummary(totalApplications.value.toString(), averageStaked.value.toString(), averageMaxRelays.value.toString());

    } catch (e) {
      return new StakedApplicationSummary("0n", "0n", "0n");
    }
  }

  /**
   * Create free tier application.
   *
   * @param {string} privateApplicationKey Application private key.
   * @param {string[]} networkChains Network chains to stake application.
   *
   * @returns {Promise<PocketAAT | boolean>} If application was created or not.
   * @async
   */
  async createFreeTierApplication(privateApplicationKey, networkChains) {
    const passphrase = "FreeTierApplication";
    const clientApplicationAccount = await this.pocketService.importAccount(privateApplicationKey, passphrase);
    const filter = {
      "publicPocketAccount.address": clientApplicationAccount.addressHex
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (!applicationDB) {
      return false;
    }

    const clientApplication = PocketApplication.createPocketApplication(applicationDB);

    try {
      const freeTierAccount = await this.pocketService.getFreeTierAccount(passphrase);
      const stakeAmount = Configurations.pocketNetwork.free_tier.stake_amount;

      const aat = this.__getAAT(clientApplicationAccount, freeTierAccount, passphrase);

      // Stake application using free tier account
      await this.pocketService.stakeApplication(freeTierAccount, passphrase, stakeAmount, networkChains);

      await this.__markApplicationAsFreeTier(clientApplication);

      return aat;

    } catch (e) {
      return false;
    }

  }
}
