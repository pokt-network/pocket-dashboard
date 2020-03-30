import BaseService from "./BaseService";
import {
  ApplicationNetworkInfo,
  ApplicationPrivatePocketAccount,
  ApplicationPublicPocketAccount,
  PocketApplication
} from "../models/Application";
import {PocketUser} from "../models/User";
import PocketAAT from "@pokt-network/aat-js";
import {Account} from "@pokt-network/pocket-js";
import UserService from "./UserService";
import bcrypt from "bcrypt";

const APPLICATION_COLLECTION_NAME = "Applications";

export default class ApplicationService extends BaseService {


  constructor() {
    super();

    /** @protected */
    this._userService = new UserService();
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
      const result = await this._persistenceService.saveEntity(APPLICATION_COLLECTION_NAME, application);

      return Promise.resolve(result.result.ok === 1);
    }

    return Promise.resolve(false);
  }

  /**
   * Create a pocket account in the network.
   *
   * @param {string} passPhrase Passphrase used to create pocket account.
   *
   * @returns {Promise<Account>} A Pocket account created successfully.
   * @throws {Error} If creation of account fails.
   * @private
   */
  async __createPocketAccount(passPhrase) {
    const account = await this._pocketService.createAccount(passPhrase);

    if (account instanceof Error) {
      throw account;
    }

    return account;
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
    const dbApplication = await this._persistenceService.getEntityByFilter(APPLICATION_COLLECTION_NAME, filter);

    return Promise.resolve(dbApplication !== undefined);
  }

  /**
   * Get all applications on network.
   *
   * @returns {PocketApplication[]} List of applications.
   */
  getAllApplications() {
    return null;
  }

  /**
   * Get all applications on network that belongs to user.
   *
   * @param {PocketUser} user Pocket user.
   *
   * @returns {PocketApplication[]} List of applications.
   */
  listUserApplications(user) {
    return null;
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
   * @returns {{privateApplicationData: ApplicationPrivatePocketAccount, networkData:ApplicationNetworkInfo}| boolean} An application information or false if not.
   * @throws {Error} If validation fails or already exists.
   * @async
   */
  async createApplication(applicationData) {
    if (PocketApplication.validate(applicationData)) {
      if (!await this._userService.userExists(applicationData.user)) {
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
        const privateApplicationData = await ApplicationPrivatePocketAccount.createApplicationPrivatePocketAccount(this._pocketService, pocketAccount, passPhrase);
        const networkData = ApplicationNetworkInfo.createNetworkInfoToNewApplication();

        return {privateApplicationData, networkData};
      }

      return Promise.resolve(false);
    }
  }

  /**
   * Get an AAT of the application.
   *
   * @param {PocketApplication} application Application to create AAT.
   *
   * @returns {PocketAAT} Application AAT.
   */
  getAAT(application) {
    return null;
  }
}
