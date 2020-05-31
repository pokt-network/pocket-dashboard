import {ExtendedPocketApplication, PocketApplication, StakedApplicationSummary} from "../models/Application";
import {PrivatePocketAccount, PublicPocketAccount} from "../models/Account";
import {Account, Application, PocketAAT, StakingStatus} from "@pokt-network/pocket-js";
import UserService from "./UserService";
import {Configurations} from "../_configuration";
import AccountService from "./AccountService";
import BasePocketService from "./BasePocketService";
import {TransactionPostAction} from "../models/Transaction";

const APPLICATION_COLLECTION_NAME = "Applications";

export default class ApplicationService extends BasePocketService {

  constructor() {
    super();

    this.userService = new UserService();
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
   * Get an AAT of the application.
   *
   * @param {string} clientPublicKey Client account public key to create AAT.
   * @param {Account} applicationAccount Application account to create AAT.
   * @param {string} applicationPassphrase Application passphrase.
   *
   * @returns {PocketAAT} Application AAT.
   */
  async __getAAT(clientPublicKey, applicationAccount, applicationPassphrase) {
    return this.pocketService.getApplicationAuthenticationToken(clientPublicKey, applicationAccount, applicationPassphrase);
  }

  /**
   * Get average of array.
   *
   * @param {number[]} data Array data.
   *
   * @returns {number} The average of array.
   * @private
   */
  __getAverage(data) {
    return data.reduce((a, b) => a + b, 0) / data.length;
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
   * @throws Error If application already exists on dashboard or application does exist on network.
   * @async
   */
  async importApplication(applicationAddress) {
    const filter = {
      "publicPocketAccount.address": applicationAddress
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (applicationDB) {
      throw Error("Application already exists in dashboard");
    }

    try {
      return this.pocketService.getApplication(applicationAddress);
    } catch (e) {
      throw TypeError("Application does not exist on network");
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
   * @param {number} [stakingStatus] Staking status filter.
   *
   * @returns {ExtendedPocketApplication[]} List of applications.
   * @async
   */
  async getAllApplications(limit, offset = 0, stakingStatus = undefined) {
    const applications = (await this.persistenceService.getEntities(APPLICATION_COLLECTION_NAME, {}, limit, offset))
      .map(PocketApplication.createPocketApplication);

    if (applications) {
      const extendedApplications = await this.__getExtendedPocketApplications(applications);

      if (stakingStatus !== undefined) {
        return extendedApplications.filter((application) => application.networkData.status === StakingStatus.getStatus(stakingStatus));
      }

      return extendedApplications;
    }

    return [];
  }

  /**
   * Get all applications on network that belongs to user.
   *
   * @param {string} userEmail Email of user.
   * @param {number} limit Limit of query.
   * @param {number} [offset] Offset of query.
   * @param {number} [stakingStatus] Staking status filter.
   *
   * @returns {Promise<ExtendedPocketApplication[]>} List of applications.
   * @async
   */
  async getUserApplications(userEmail, limit, offset = 0, stakingStatus = undefined) {
    const filter = {user: userEmail};
    const applications = (await this.persistenceService.getEntities(APPLICATION_COLLECTION_NAME, filter, limit, offset))
      .map(PocketApplication.createPocketApplication);

    if (applications) {
      const extendedApplications = await this.__getExtendedPocketApplications(applications);

      if (stakingStatus !== undefined) {
        return extendedApplications.filter((application) => application.networkData.status === StakingStatus.getStatus(stakingStatus));
      }

      return extendedApplications;
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

      const averageStaked = this.__getAverage(stakedApplications.map(app => parseInt(app.stakedTokens.toString())));
      const averageRelays = this.__getAverage(stakedApplications.map(app => parseInt(app.maxRelays.toString())));

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

    const clientApplication = PocketApplication.createPocketApplication(applicationDB);

    try {
      const {account: freeTierAccount, passphrase} = await this.pocketService.getFreeTierAccount();

      return this.__getAAT(clientApplication.publicPocketAccount.publicKey, freeTierAccount, passphrase);

    } catch (e) {
      return false;
    }
  }

  /**
   * Stake a free tier application.
   *
   * @param {{privateKey: string, passphrase:string}} application Application to stake.
   * @param {string[]} networkChains Network chains to stake application.
   *
   * @returns {Promise<PocketAAT | boolean>} If application was created or not.
   * @async
   */
  async stakeFreeTierApplication(application, networkChains) {
    const accountService = new AccountService();

    const applicationAccount = await accountService.importAccountToNetwork(this.pocketService, application.privateKey, application.passphrase);

    const filter = {
      "publicPocketAccount.address": applicationAccount.addressHex
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (!applicationDB) {
      throw Error("Application does not exists on dashboard");
    }

    const clientApplication = PocketApplication.createPocketApplication(applicationDB);
    const {account: freeTierAccount, passphrase: freeTierPassphrase} = await this.pocketService.getFreeTierAccount();
    const {stake_amount: stakeAmount} = Configurations.pocket_network.free_tier;

    const transferTransaction = await this.pocketService
      .transferPoktBetweenAccounts(freeTierAccount, freeTierPassphrase, applicationAccount, stakeAmount);

    const postAction = TransactionPostAction
      .createStakeApplicationPostAction(applicationAccount, stakeAmount, networkChains);

    await this.transactionService.addTransaction(transferTransaction.hash, postAction);

    await this.__markApplicationAsFreeTier(clientApplication, true);

    return this.__getAAT(clientApplication.publicPocketAccount.publicKey, freeTierAccount, freeTierPassphrase);
  }

  /**
   * Unstake free tier application.
   *
   * @param {{privateKey:string, passphrase:string, accountAddress: string}} applicationData Application data.
   *
   * @returns {Promise<PocketApplication | boolean>} If application was unstaked return the application, if not return false.
   * @async
   */
  async unstakeFreeTierApplication(applicationData) {
    const filter = {
      "publicPocketAccount.address": applicationData.accountAddress
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (!applicationDB) {
      return false;
    }

    const accountService = new AccountService();
    const applicationAccount = await accountService.importAccountToNetwork(this.pocketService, applicationData.privateKey, applicationData.passphrase);

    const {account: freeTierAccount} = this.pocketService.getFreeTierAccount();
    const {stake_amount: stakeAmount} = Configurations.pocket_network.free_tier;

    await this.pocketService
      .unstakeApplication(applicationAccount, applicationData.passphrase);

    await this.pocketService
      .transferPoktBetweenAccounts(applicationAccount, applicationData.passphrase, freeTierAccount, stakeAmount);

    const clientApplication = PocketApplication.createPocketApplication(applicationDB);

    await this.__markApplicationAsFreeTier(clientApplication, false);

    return clientApplication;
  }

  /**
   * Stake an application on network.
   *
   * @param {{privateKey: string, passphrase:string}} application Application to stake.
   * @param {string[]} networkChains Network chains to stake application.
   * @param {string} uPoktAmount uPokt amount used to stake.
   *
   * @returns {Promise<PocketApplication | boolean>} If was staked return the application, if not return false.
   * @throws Error If private key is not valid or application does not exists on dashboard.
   */
  async stakeApplication(application, networkChains, uPoktAmount) {
    const accountService = new AccountService();
    const applicationAccount = await accountService
      .importAccountToNetwork(this.pocketService, application.privateKey, application.passphrase);

    const filter = {
      "publicPocketAccount.address": applicationAccount.addressHex
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (!applicationDB) {
      throw Error("Application does not exists on dashboard");
    }

    // FIXME: Now we use free tier for account to transfer the amount to stake the app on custom tier.
    const {account: freeTierAccount, passphrase: freeTierPassphrase} = await this.pocketService.getFreeTierAccount();

    // TODO:(Possible issue) Verify the uPOKTAmount to stake, because you can discount from application account.
    const transferTransaction = await this.pocketService
      .transferPoktBetweenAccounts(freeTierAccount, freeTierPassphrase, applicationAccount, uPoktAmount);

    const postAction = TransactionPostAction
      .createStakeApplicationPostAction(applicationAccount, uPoktAmount, networkChains);

    await this.transactionService.addTransaction(transferTransaction.hash, postAction);

    return PocketApplication.createPocketApplication(applicationDB);
  }

  /**
   * Unstake application.
   *
   * @param {{privateKey:string, passphrase:string, accountAddress: string}} applicationData Application data.
   *
   * @returns {Promise<PocketApplication | boolean>} If application was unstaked return application, if not return false.
   * @async
   */
  async unstakeApplication(applicationData) {
    const filter = {
      "publicPocketAccount.address": applicationData.accountAddress
    };

    const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    if (!applicationDB) {
      return false;
    }
    const accountService = new AccountService();
    const applicationAccount = await accountService
      .importAccountToNetwork(this.pocketService, applicationData.privateKey, applicationData.passphrase);

    const unstakeTransaction = await this.pocketService
      .unstakeApplication(applicationAccount, applicationData.passphrase);

    await this.transactionService.addTransaction(unstakeTransaction.hash);

    return PocketApplication.createPocketApplication(applicationDB);
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

      return this.__persistApplicationIfNotExists(application);
    }
  }

  /**
   * Create an application account.
   *
   * @param {string} applicationID Application ID.
   * @param {string} passphrase Application account passphrase.
   * @param {string} [privateKey] Application private key if is imported.
   *
   * @returns {Promise<{application: PocketApplication, privateApplicationData: PrivatePocketAccount, networkData:Application}>} An application information.
   * @throws {Error} If application does not exists.
   * @async
   */
  async createApplicationAccount(applicationID, passphrase, privateKey = "") {

    const applicationDB = await this.persistenceService.getEntityByID(APPLICATION_COLLECTION_NAME, applicationID);

    if (!applicationDB) {
      throw new Error("Application does not exists");
    }

    const application = PocketApplication.createPocketApplication(applicationDB);

    const accountService = new AccountService();
    const pocketAccount = await accountService.createPocketAccount(this.pocketService, passphrase, privateKey);

    application.publicPocketAccount = PublicPocketAccount.createPublicPocketAccount(pocketAccount);

    await this.__updateApplicationByID(applicationID, application);

    const appParameters = await this.pocketService.getApplicationParameters();

    const privateApplicationData = await PrivatePocketAccount.createPrivatePocketAccount(this.pocketService, pocketAccount, passphrase);
    const networkData = ExtendedPocketApplication.createNetworkApplication(application.publicPocketAccount, appParameters);

    // noinspection JSValidateTypes
    return {application, privateApplicationData, networkData};
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
   * @throws {Error} If validation fails or does not exists.
   * @async
   */
  async updateApplication(applicationAccountAddress, applicationData) {
    if (PocketApplication.validate(applicationData)) {
      if (!await this.userService.userExists(applicationData.user)) {
        throw new Error("User does not exists");
      }

      const application = PocketApplication.createPocketApplication(applicationData);
      const filter = {
        "publicPocketAccount.address": applicationAccountAddress
      };

      const applicationDB = await this.persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

      if (!applicationDB) {
        throw new Error("Application does not exists");
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
