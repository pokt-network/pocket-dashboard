import BaseService from "./BaseService";
import {ApplicationKeys, ApplicationPoktAccount, PocketApplication} from "../models/Application";
import {PocketUser} from "../models/User";

export default class ApplicationService extends BaseService {

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
   * @param {PocketApplication} application Application to create.
   *
   * @returns {ApplicationPoktAccount} An application account.
   */
  createApplication(application) {
    return null;
  }

  /**
   * Create an AAT to the application.
   *
   * @param {PocketApplication} application Application to create AAT.
   *
   * @returns {ApplicationKeys} Application keys.
   */
  createAAT(application) {
    return null;
  }

}
