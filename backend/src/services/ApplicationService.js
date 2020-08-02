import {
  ExtendedPocketApplication,
  PocketApplication,
  RegisteredPocketApplication,
  StakedApplicationSummary,
  UserPocketApplication
} from "../models/Application";
import {PrivatePocketAccount, PublicPocketAccount} from "../models/Account";
import {Application, PocketAAT, StakingStatus, typeGuard, UnlockedAccount} from "@pokt-network/pocket-js";
import UserService from "./UserService";
import BasePocketService from "./BasePocketService";
import bigInt from "big-integer";
import {DashboardError, DashboardValidationError, PocketNetworkError} from "../models/Exceptions";
import TransactionService from "./TransactionService";
import {POST_ACTION_TYPE, TransactionPostAction} from "../models/Transaction";
import {Configurations} from "../_configuration";
import {POKT_DENOMINATIONS} from "./PocketService";
import PocketService from "./PocketService";
import {ObjectID} from "mongodb";

const APPLICATION_COLLECTION_NAME = "Applications";

export default class ApplicationService extends BasePocketService {

  constructor() {
    super();

    this.userService = new UserService();
    this.transactionService = new TransactionService();
    this.pocketService = new PocketService();
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
        "_id": ObjectID(application.id)
      };

      delete application.id;

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
    const extendedPocketApplication = ExtendedPocketApplication.createExtendedPocketApplication(application, networkApplication);

    return extendedPocketApplication;
  }

  /**
   *
   * @param {PocketApplication} application Application to add pocket data.
   *
   * @returns {Promise<ExtendedPocketApplication>} Pocket application with pocket data.
   * @private
   * @async
   */
  async __getExtendedPocketClientApplication(application) {
    let networkApplication;
    const appParameters = await this.pocketService.getApplicationParameters();
    const address = application.freeTierApplicationAccount.address || application.publicPocketAccount.address;

    try {
      networkApplication = await this.pocketService.getApplication(address);
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
      "_id": ObjectID(application.id)
    };

    application.freeTier = freeTier;
    /** @type {{result: {n:number, ok: number}}} */
    const result = await this.persistenceService.updateEntity(APPLICATION_COLLECTION_NAME, filter, application);
    
    return result.result.ok === 1;
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
      throw new PocketNetworkError("Application does not exist on network");
    }
  }

  /**
   * Get client's application account data.
   *
   * @param {string} applicationId Application address.
   *
   * @returns {Promise<ExtendedPocketApplication>} Application data.
   * @async
   */
  async getClientApplication(applicationId) {
    const filter = {
      "_id": ObjectID(applicationId)
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (applicationDB) {
      const application = PocketApplication.createPocketApplication(applicationDB);

      return this.__getExtendedPocketClientApplication(application);
    }

    return null;
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
   * Get private application data.
   *
   * @param {string} applicationId Application Id.
   *
   * @returns {Promise<ExtendedPocketApplication>} Application data.
   * @async
   */
  async getPrivateApplication(applicationId) {
    const filter = {
      "_id": ObjectID(applicationId)
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (applicationDB) {
      const application = PocketApplication.createPocketPrivateApplication(applicationDB);

      return this.__getExtendedPocketApplication(application);
    }

    return null;
  }

  /**
   * Get application data on network.
   *
   * @param {string} applicationAddress Application address.
   *
   * @returns {Promise<Application>} Application data.
   * @async
   */
  async getNetworkApplication(applicationAddress) {
    return this.pocketService.getApplication(applicationAddress);
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
          address: app.freeTierApplicationAccount.address || app.publicPocketAccount.address,
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

  /**
   * Get AAT using Free tier account.
   *
   * @param {string} clientAccountAddress The client account address(In this case is the account of application).
   *
   * @returns {Promise<PocketAAT | boolean>} AAT for application.
   * @async
   */
  async getFreeTierAAT(clientAccountAddress) {

    const filter = {
      "publicPocketAccount.address": clientAccountAddress
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (!applicationDB) {
      return false;
    }

    try {
      const {aat_version: aatVersion} = Configurations.pocket_network;
      const {
        publicPocketAccount: {
          publicKey: applicationPublicKeyHex
        },
        freeTierApplicationAccount: {
          publicKey: appAccountPublicKeyHex,
          privateKey: appAccountPrivateKeyHex
        }
      } = applicationDB;

      return await PocketAAT.from(aatVersion, applicationPublicKeyHex, appAccountPublicKeyHex, appAccountPrivateKeyHex);
    } catch (e) {
      return false;
    }
  }
  /**
   * Stake a free tier application.
   *
   * @param {ExtendedPocketApplication} application Application to stake.
   * @param {{app_address: string, chains: string[], stake_amount: string}} stakeInformation Information for the stake action.
   * @param {{name: string, link: string}} emailData Email data.
   *
   * @returns {Promise<PocketAAT | boolean>} If application was created or not.
   * @async
   */
  async stakeFreeTierApplication(application, stakeInformation, emailData) {
    const {
      main_fund_address: mainFundAccount,
      aat_version: aatVersion,
      free_tier: {stake_amount: upoktToStake, max_relay_per_day_amount: maxRelayPerDayAmount}
    } = Configurations.pocket_network;

    if (aatVersion === undefined || upoktToStake === undefined || maxRelayPerDayAmount === undefined) {
      throw new Error("Couldn't retrieve aatVersion and/or upoktToStake and/or maxRelayPerDayAmount values for free tier stake.");
    }

    // Generate a passphrase for the app account
    const passphrase = mainFundAccount;

    // Create Application credentials.
    const appAccount = await this.pocketService.createUnlockedAccount(passphrase);

    if (!typeGuard(appAccount, UnlockedAccount)) {
      throw appAccount;
    }

    const appAccountPublicKeyHex = appAccount.publicKey.toString("hex");
    const appAccountPrivateKeyHex = appAccount.privateKey.toString("hex");

    // First transfer funds from the main fund to the new Application account.
    const fundingTransactionHash = await this.pocketService.transferFromMainFund(upoktToStake, appAccount.addressHex);

    // Create the stake transaction object
    const appStakeTransaction = await this.pocketService.appStakeRequest(appAccount.addressHex, passphrase, stakeInformation.chains, stakeInformation.stake_amount);

    // Create post confirmation action to stake application.
    const contactEmail = application.pocketApplication.contactEmail;

    const appStakeAction = new TransactionPostAction(POST_ACTION_TYPE.stakeApplication, {
      appStakeTransaction,
      contactEmail,
      emailData,
      paymentEmailData: {
        amountPaid: 0,
        poktStaked: upoktToStake / Math.pow(10, POKT_DENOMINATIONS.upokt),
        maxRelayPerDayAmount
      }
    });

    // Create job to monitor transaction confirmation
    const result = await this.transactionService.addTransferTransaction(fundingTransactionHash, appStakeAction);

    if (!result) {
      throw new Error("Couldn't add funding transaction for processing");
    }

    // Set the free tier credentials.
    application.pocketApplication.freeTierApplicationAccount = new PrivatePocketAccount(appAccount.addressHex, appAccountPublicKeyHex, appAccountPrivateKeyHex);
    application.pocketApplication.freeTier = true;
    // Update application.
    await this.__updatePersistedApplication(application.pocketApplication);
    
    const aat = await PocketAAT.from(aatVersion, application.pocketApplication.publicPocketAccount.publicKey, appAccountPublicKeyHex, appAccountPrivateKeyHex);

    if (typeGuard(aat, PocketAAT)) {
      return aat;
    } else {
      throw new Error("Failed to generate the AAT.");
    }
  }

  /**
   * Unstake free tier application.
   *
   * @param {object} unstakeInformation Object that holds the unstake information
   * @param {string} applicationLink Link to detail for email.
   *
   * @async
   */
  async unstakeFreeTierApplication(unstakeInformation, applicationLink) {
    // Retrieve the private application account information

    const application = await this.getPrivateApplication(unstakeInformation.application_id);
    const freeTierApplicationAccount = application.pocketApplication.freeTierApplicationAccount;

    // Generate a passphrase for the app account
    const passphrase = Math.random().toString(36).substr(2, 8);

    // Import the application to the keybase
    const pocketAccount = await this.pocketService.importAccountFromPrivateKey(freeTierApplicationAccount.privateKey, passphrase);

    // Create unstake transaction request
    const appUnstakeRequest = await this.pocketService.appUnstakeRequest(pocketAccount.addressHex, passphrase);

    // Submit transaction
    const appUnstakedTransaction = await this.pocketService.submitRawTransaction(appUnstakeRequest.address, appUnstakeRequest.txHex);

    const emailData = {
      userName: application.pocketApplication.user,
      contactEmail: application.pocketApplication.contactEmail,
      applicationData: {
        name: application.pocketApplication.name,
        link: applicationLink
      }
    };

    // Add transaction to queue
    const result = await this.transactionService.addAppUnstakeTransaction(appUnstakedTransaction, emailData);

    if (!result) {
      throw new Error("Couldn't register app unstake transaction for email notification");
    }

    await this.__markApplicationAsFreeTier(application.pocketApplication, false);
  }

  /**
   * Stake an application on network.
   *
   * @param {string} appAddress Application address.
   * @param {string} upoktToStake UPokt to stake.
   * @param {{address: string, raw_hex_bytes: string}} appStakeTransaction Transaction to stake.
   * @param {ExtendedPocketApplication} application Application to stake.
   * @param {{name: string, link: string}} emailData Email data.
   * @param {object} paymentEmailData Payment email data.
   *
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
      throw new Error("Couldn't add funding transaction for processing");
    }

    await this.__markApplicationAsFreeTier(application.pocketApplication, false);
  }

  /**
   * Unstake application.
   *
   * @param {object} appUnstakeTransaction Transaction object.
   * @param {string} appUnstakeTransaction.address Sender address
   * @param {string} appUnstakeTransaction.raw_hex_bytes Raw transaction bytes
   * @param {string} applicationLink Link to detail for email.
   *
   * @async
   */
  async unstakeApplication(appUnstakeTransaction, applicationLink) {
    const {
      address,
      raw_hex_bytes
    } = appUnstakeTransaction;

    // Submit transaction
    const appUnstakedHash = await this.pocketService.submitRawTransaction(address, raw_hex_bytes);

    // Gather email data
    const application = await this.getApplication(address);
    const emailData = {
      userName: application.pocketApplication.user,
      contactEmail: application.pocketApplication.contactEmail,
      applicationData: {
        name: application.pocketApplication.name,
        link: applicationLink
      }
    };

    // Add transaction to queue
    const result = await this.transactionService.addAppUnstakeTransaction(appUnstakedHash, emailData);

    if (!result) {
      throw new Error("Couldn't register app unstake transaction for email notification");
    }

    await this.__markApplicationAsFreeTier(application.pocketApplication, false);
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
   * Delete an application from dashboard.
   *
   * @param {string} applicationId Application Id.
   * @param {string} user Owner email of application.
   *
   * @returns {Promise<PocketApplication>} The deleted application.
   * @async
   */
  async deleteApplication(applicationId, user) {
    const filter = {
      "_id": ObjectID(applicationId),
      user
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    await this.persistenceService.deleteEntities(APPLICATION_COLLECTION_NAME, filter);

    return PocketApplication.createPocketApplication(applicationDB);
  }

  /**
   * Update an application on network.
   *
   * @param {string} applicationId Application Id.
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
  async updateApplication(applicationId, applicationData) {
    if (PocketApplication.validate(applicationData)) {
      if (!await this.userService.userExists(applicationData.user)) {
        throw new DashboardError("User does not exists");
      }

      const application = PocketApplication.createPocketApplication(applicationData);
      const filter = {
        "_id": ObjectID(applicationId)
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
