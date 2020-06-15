import {
  ExtendedPocketApplication,
  PocketApplication,
  RegisteredPocketApplication,
  StakedApplicationSummary,
  UserPocketApplication
} from "../models/Application";
import {PublicPocketAccount} from "../models/Account";
import {Application, PocketAAT, StakingStatus} from "@pokt-network/pocket-js";
import UserService from "./UserService";
import BasePocketService from "./BasePocketService";
import bigInt from "big-integer";
import {DashboardError, DashboardValidationError, PocketNetworkError} from "../models/Exceptions";
import TransactionService from "./TransactionService";
import { TransactionPostAction, POST_ACTION_TYPE } from "../models/Transaction";

const APPLICATION_COLLECTION_NAME = "Applications";

export default class ApplicationService extends BasePocketService {

  constructor() {
    super();

    this.userService = new UserService();
    this.transactionService = new TransactionService()
  }

  /**
   * Persist application on db if not exists.
   *
   * @param {PocketApplication} application Application to persist.
   *
   * @returns {Promise<string | boolean>} If application was persisted return id, if not return false.
   * @private
   * @async
   */
  async __persistApplicationIfNotExists(application) {
    if (!await this.applicationExists(application)) {
      /** @type {{insertedId: string, result: {n:number, ok: number}}} */
      const result = await this.persistenceService.saveEntity(APPLICATION_COLLECTION_NAME, application);

      return result.result.ok === 1 ? result.insertedId : "0";
    }

    return false;
  }

  /**
   * Update application on db if exists.
   *
   * @param {PocketApplication} application Application to update.
   *
   * @returns {Promise<boolean>} If application was updated or not.
   * @private
   * @async
   */
  async __updatePersistedApplication(application) {
    if (await this.applicationExists(application)) {
      const filter = {
        "publicPocketAccount.address": application.publicPocketAccount.address
      };

      /** @type {{result: {n:number, ok: number}}} */
      const result = await this.persistenceService.updateEntity(APPLICATION_COLLECTION_NAME, filter, application);

      return result.result.ok === 1;
    }

    return false;
  }

  /**
   * Update application on db by ID.
   *
   * @param {string} applicationID Application ID.
   * @param {PocketApplication} applicationData Application data.
   *
   * @returns {Promise<boolean>} If application was updated or not.
   * @private
   * @async
   */
  async __updateApplicationByID(applicationID, applicationData) {
    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.updateEntityByID(APPLICATION_COLLECTION_NAME, applicationID, applicationData);

    return result.result.ok === 1;
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
    let networkApplication;
    const appParameters = await this.pocketService.getApplicationParameters();

    try {
      networkApplication = await this.pocketService.getApplication(application.publicPocketAccount.address);
    } catch (e) {
      networkApplication = ExtendedPocketApplication.createNetworkApplication(application.publicPocketAccount, appParameters);
    }

    return ExtendedPocketApplication.createExtendedPocketApplication(application, networkApplication);
  }

  /**
   * Mark application as free tier.
   *
   * @param {PocketApplication} application Pocket application to mark as free tier.
   * @param {boolean} freeTier If is free tier or not.
   *
   * @private
   */
  async __markApplicationAsFreeTier(application, freeTier) {
    const filter = {
      "publicPocketAccount.address": application.publicPocketAccount.address
    };

    application.freeTier = freeTier;
    await this.persistenceService.updateEntity(APPLICATION_COLLECTION_NAME, filter, application);
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
    let filter = {};

    if (application.publicPocketAccount.address) {
      filter["publicPocketAccount.address"] = application.publicPocketAccount.address;
    } else {
      filter["name"] = application.name;
    }

    const dbApplication = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    return dbApplication !== undefined;
  }

  /**
   * Import application data from network.
   *
   * @param {string} applicationAddress Application address.
   *
   * @returns {Promise<Application>} Application data.
   * @throws {DashboardValidationError | PocketNetworkError} If application already exists on dashboard or application does exist on network.
   * @async
   */
  async importApplication(applicationAddress) {
    const filter = {
      "publicPocketAccount.address": applicationAddress
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (applicationDB) {
      throw new DashboardValidationError("Application already exists in dashboard");
    }

    try {
      return this.pocketService.getApplication(applicationAddress);
    } catch (e) {
      console.error(e);
      throw new PocketNetworkError("Application does not exist on network");
    }
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
   * @returns {RegisteredPocketApplication[]} List of applications.
   * @async
   */
  async getAllApplications(limit, offset = 0) {
    const networkApplications = await this.pocketService.getApplications(StakingStatus.Staked);

    return networkApplications.map(PocketApplication.createRegisteredPocketApplication);
  }

  /**
   * Get all applications on network that belongs to user.
   *
   * @param {string} userEmail Email of user.
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   *
   * @returns {Promise<UserPocketApplication[]>} List of applications.
   * @async
   */
  async getUserApplications(userEmail, limit, offset = 0) {
    const filter = {user: userEmail};

    const dashboardApplicationData = (await this.persistenceService.getEntities(APPLICATION_COLLECTION_NAME, filter, limit, offset))
      .map(PocketApplication.createPocketApplication)
      .map(app => {
        return {
          id: app.id,
          name: app.name,
          address: app.publicPocketAccount.address,
          icon: app.icon
        };
      });

    const dashboardApplicationAddresses = dashboardApplicationData
      .map(app => app.address)
      .filter(address => address.length > 0);

    const networkApplications = await this.pocketService
      .getAllApplications(dashboardApplicationAddresses);

    if (dashboardApplicationData.length > 0) {
      return dashboardApplicationData
        .map(app => PocketApplication.createUserPocketApplication(app, networkApplications));
    }

    return [];
  }

  /**
   * Get staked application summary from network.
   *
   * @returns {Promise<StakedApplicationSummary>} Summary data of staked applications.
   * @async
   */
  async getStakedApplicationSummary() {
    try {
      const stakedApplications = await this.pocketService.getApplications(StakingStatus.Staked);

      const averageStaked = this._getAverageNetworkData(stakedApplications.map(app => bigInt(app.stakedTokens.toString())));
      const averageRelays = this._getAverageNetworkData(stakedApplications.map(app => bigInt(app.maxRelays.toString())));

      return new StakedApplicationSummary(stakedApplications.length.toString(), averageStaked.toString(), averageRelays.toString());
    } catch (e) {
      return new StakedApplicationSummary("0", "0", "0");
    }
  }

  // TODO Move this logic to the frontend.
  // /**
  //  * Get AAT using Free tier account.
  //  *
  //  * @param {string} clientAccountAddress The client account address(In this case is the account of application).
  //  *
  //  * @returns {Promise<PocketAAT | boolean>} AAT for application.
  //  * @async
  //  */
  // async getFreeTierAAT(clientAccountAddress) {
  //
  //   const filter = {
  //     "publicPocketAccount.address": clientAccountAddress
  //   };
  //
  //   const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);
  //
  //   if (!applicationDB) {
  //     return false;
  //   }
  //
  //   const clientApplication = PocketApplication.createPocketApplication(applicationDB);
  //
  //   try {
  //     const {account: freeTierAccount, passphrase} = await this.pocketService.getFreeTierAccount();
  //
  //
  //     // return this.__getAAT(clientApplication.publicPocketAccount.publicKey, freeTierAccount, passphrase);
  //
  //   } catch (e) {
  //     return false;
  //   }
  // }

  /**
   * Stake a free tier application.
   *
   * @param {string} transactionHash Transaction to stake.
   *
   * @returns {Promise<PocketAAT | boolean>} If application was created or not.
   * @async
   */
  async stakeFreeTierApplication(transactionHash) {
    // TODO: Use the transaction.
  }

  /**
   * Unstake free tier application.
   *
   * @param {string} transactionHash Transaction to stake.
   *
   * @returns {Promise<PocketApplication | boolean>} If application was unstaked return the application, if not return false.
   * @async
   */
  async unstakeFreeTierApplication(transactionHash) {
    // TODO: Use the transaction.
  }

  /**
   * Stake an application on network.
   *
   * @param {}
   * @param {object} appStakeTransaction Transaction to stake.
   * @throws {Error}
   */
  async stakeApplication(appAddress, upoktToStake, appStakeTransaction, application, emailData, paymentEmailData) {
    // First transfer funds from the main fund
    const fundingTransactionHash = await this.pocketService.transferFromMainFund(upoktToStake, appAddress);

    // Create post confirmation action to stake application
    const contactEmail = application.pocketApplication.contactEmail;
    const appStakeAction = new TransactionPostAction(POST_ACTION_TYPE.stakeApplication, {
      appStakeTransaction,
      contactEmail,
      emailData,
      paymentEmailData
    });

    // Create job to monitor transaction confirmation
    const result = await this.transactionService.addTransferTransaction(fundingTransactionHash, appStakeAction);
    if (!result) {
      throw new Error("Couldn't add funding transaction for processing")
    }
  }

  /**
   * Unstake application.
   *
   * @param {string} transactionHash Transaction to stake.
   *
   * @async
   */
  async unstakeApplication(transactionHash) {
    // TODO: Use the transaction.
  }

  /**
   * Create an application on dashboard.
   *
   * @param {object} applicationData Application data.
   * @param {string} applicationData.name Name.
   * @param {string} applicationData.owner Owner.
   * @param {string} applicationData.url URL.
   * @param {string} applicationData.contactEmail E-mail.
   * @param {string} applicationData.user User.
   * @param {string} [applicationData.description] Description.
   * @param {string} [applicationData.icon] Icon.
   *
   * @returns {Promise<string | boolean>} If application was persisted return id, if not return false.
   * @throws {DashboardError} If validation fails or already exists.
   * @async
   */
  async createApplication(applicationData) {
    if (PocketApplication.validate(applicationData)) {
      if (!await this.userService.userExists(applicationData.user)) {
        throw new DashboardError("User does not exist.");
      }

      const application = PocketApplication.createPocketApplication(applicationData);

      if (await this.applicationExists(application)) {
        throw new DashboardError("An application with that name already exists, please use a different name.");
      }

      return this.__persistApplicationIfNotExists(application);
    }
  }

  /**
   * Save an application public account.
   *
   * @param {string} applicationID Application ID.
   * @param {{address: string, publicKey: string}} accountData Application account data.
   *
   * @returns {Promise<PocketApplication>} An application information.
   * @throws {Error} If application does not exists.
   * @async
   */
  async saveApplicationAccount(applicationID, accountData) {

    const applicationDB = await this.persistenceService.getEntityByID(APPLICATION_COLLECTION_NAME, applicationID);

    if (!applicationDB) {
      throw new Error("Application does not exists");
    }

    const application = PocketApplication.createPocketApplication(applicationDB);

    application.publicPocketAccount = new PublicPocketAccount(accountData.address, accountData.publicKey);

    await this.__updateApplicationByID(applicationID, application);

    return application;
  }

  /**
   * Delete an application from dashboard(not from network).
   *
   * @param {string} applicationAccountAddress Application account address.
   * @param {string} user Owner email of application.
   *
   * @returns {Promise<PocketApplication>} The deleted application.
   * @async
   */
  async deleteApplication(applicationAccountAddress, user) {
    const filter = {
      "publicPocketAccount.address": applicationAccountAddress,
      user
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    await this.persistenceService.deleteEntities(APPLICATION_COLLECTION_NAME, filter);

    return PocketApplication.createPocketApplication(applicationDB);
  }

  /**
   * Update an application on network.
   *
   * @param {string} applicationAccountAddress Application account address.
   * @param {object} applicationData Application data.
   * @param {string} applicationData.name Name.
   * @param {string} applicationData.owner Owner.
   * @param {string} applicationData.url URL.
   * @param {string} applicationData.contactEmail E-mail.
   * @param {string} applicationData.user User.
   * @param {string} [applicationData.description] Description.
   * @param {string} [applicationData.icon] Icon.
   *
   * @returns {Promise<boolean>} If was updated or not.
   * @throws {DashboardError} If validation fails or does not exists.
   * @async
   */
  async updateApplication(applicationAccountAddress, applicationData) {
    if (PocketApplication.validate(applicationData)) {
      if (!await this.userService.userExists(applicationData.user)) {
        throw new DashboardError("User does not exists");
      }

      const application = PocketApplication.createPocketApplication(applicationData);
      const filter = {
        "publicPocketAccount.address": applicationAccountAddress
      };

      const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

      if (!applicationDB) {
        throw new DashboardError("Application does not exists");
      }

      const applicationToEdit = {
        ...application,
        publicPocketAccount: applicationDB.publicPocketAccount
      };

      return this.__updatePersistedApplication(applicationToEdit);
    }

    return false;
  }
}
