import PersistenceProvider from "../providers/data/PersistenceProvider";
import PocketService, {get_default_pocket_network} from "./PocketService";
import {Account, StakingStatus} from "@pokt-network/pocket-js";


export default class BaseService {
  constructor() {
    const pocketData = get_default_pocket_network();

    this.persistenceService = new PersistenceProvider();
    this.pocketService = new PocketService(pocketData.nodes, pocketData.rpcProvider);

    this._noop = () => {
    };
  }

  /**
   * Wait until account has balance.
   *
   * @param {Account} account Account to wait until has balance.
   * @async
   * @protected
   */
  async _waitUntilHasBalance(account) {
    while (!await this.pocketService.hasBalance(account, false)) {
      this._noop();
    }
  }

  /**
   * Check if the account status on network.
   *
   * @param {Account} account Account.
   * @param {StakingStatus} status Application status.
   *
   * @returns {Promise<boolean>} If is in this status or not.
   * @protected
   * @async
   */
  async _isApplicationOnNetwork(account, status) {
    const applications = await this.pocketService.getApplications(status);

    const application = applications
      .filter((application) => application.address === account.addressHex);

    return application && application.length > 0;
  }

  /**
   * Wait until account is on network.
   *
   * @param {Account} account Account.
   * @param {StakingStatus} status Status.
   * @protected
   * @async
   */
  async _waitUntilIsOnNetwork(account, status) {
    // Wait until application was staked.
    while (!await this._isApplicationOnNetwork(account, status)) {
      this._noop();
    }
  }
}
