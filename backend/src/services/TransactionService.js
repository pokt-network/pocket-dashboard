import BaseService from "./BaseService";
import {PocketTransaction, POST_ACTION_TYPE, TransactionPostAction} from "../models/Transaction";
import CronJobService from "./CronJobService";

const PENDING_TRANSACTION_COLLECTION_NAME = "PendingTransactions";

const CRON_SERVICE = new CronJobService();

export default class TransactionService extends BaseService {

  /**
   * @param {PocketTransaction} pocketTransaction Transaction.
   * @private
   */
  async __addTransaction(pocketTransaction) {

    /** @type {{result: {n:number, ok: number}}} */
    const saveResult = await this.persistenceService
      .saveEntity(PENDING_TRANSACTION_COLLECTION_NAME, pocketTransaction);

    return saveResult.result.ok === 1;
  }

  /**
   * @param {PocketTransaction} pocketTransaction transaction.
   * @private
   */
  async __updateTransaction(pocketTransaction) {

    const filter = {
      hash: pocketTransaction.hash
    };

    let transaction = await this.persistenceService.getEntityByFilter(PENDING_TRANSACTION_COLLECTION_NAME, filter);

    if (transaction) {
      // Update the only editable field for the pending transactions.
      transaction.completed = pocketTransaction.completed;

      return this.persistenceService.updateEntity(PENDING_TRANSACTION_COLLECTION_NAME, filter, transaction);
    }

    return false;
  }

  /**
   *
   * @param {*} transactionHash
   * @param {*} postAction
   */

  /**
   * Add transfer transaction.
   *
   * @param {string} transactionHash Transaction hash.
   * @param {TransactionPostAction} postAction Post action.
   *
   * @returns {Promise<boolean>} If was added or not.
   */
  async addTransferTransaction(transactionHash, postAction = undefined) {
    const pocketTransaction = new PocketTransaction(new Date(), transactionHash, postAction);

    let saved = await this.__addTransaction(pocketTransaction);

    if (saved && postAction) {
      saved = await CRON_SERVICE.addPendingTransaction(pocketTransaction);
    }

    return saved;
  }

  /**
   * Add stake transaction.
   *
   * @param {string} appStakeTxHash The transaction hash for the submitted app stake transaction
   * @param {{appStakeTransaction: object, contactEmail: string, emailData: object, paymentEmailData: object, address: string}} appStakeData App Stake Data
   * @returns {Promise<boolean>} if was added or not.
   */
  async addAppStakeTransaction(appStakeTxHash, appStakeData) {
    const pocketTransaction = new PocketTransaction(new Date(), appStakeTxHash, new TransactionPostAction(POST_ACTION_TYPE.stakeApplication, appStakeData));

    let saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      saved = await CRON_SERVICE.addAppStakeTransaction(pocketTransaction);
    }

    return saved;
  }

  /**
   * Add stake transaction.
   *
   * @param {string} nodeStakeTxHash The transaction hash for the submitted node stake transaction
   * @param {{nodeStakeTransaction: object, contactEmail: string, emailData: object, paymentEmailData: object}} nodeStakeData Node Stake Data
   * @returns {Promise<boolean>} if was added or not.
   */
  async addNodeStakeTransaction(nodeStakeTxHash, nodeStakeData) {
    const pocketTransaction = new PocketTransaction(new Date(), nodeStakeTxHash, new TransactionPostAction(POST_ACTION_TYPE.stakeNode, nodeStakeData));

    let saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      saved = CRON_SERVICE.addNodeStakeTransaction(pocketTransaction);
    }

    return saved;
  }

  /**
   * Add unstake transaction.
   *
   * @param {string} appUnstakeTxHash The transaction hash for the submitted app unstake transaction.
   * @param {object} emailData Data to submit unstake email.
   * @param {string} emailData.userName User that owns the application.
   * @param {string} emailData.contactEmail User that owns the application.
   * @param {object} emailData.applicationData Application information.
   * @param {string} emailData.applicationData.name Name of the application.
   * @param {string} emailData.applicationData.link Link to the application.
   *
   * @returns {Promise<boolean>} if was added or not.
   */
  async addAppUnstakeTransaction(appUnstakeTxHash, emailData) {
    const pocketTransaction = new PocketTransaction(new Date(), appUnstakeTxHash, new TransactionPostAction(POST_ACTION_TYPE.unstakeApplication, emailData));

    let saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      saved = await CRON_SERVICE.addAppUnstakeTransaction(pocketTransaction);
    }

    return saved;
  }

  /**
   * Add unstake transaction.
   *
   * @param {string} nodeUnstakeTxHash The transaction hash for the submitted node unstake transaction.
   * @param {object} emailData Data to submit unstake email.
   * @param {string} emailData.userName User that owns the application.
   * @param {string} emailData.contactEmail User that owns the application.
   * @param {object} emailData.nodeData Application information.
   * @param {string} emailData.nodeData.name Name of the application.
   * @param {string} emailData.nodeData.link Link to the application.
   *
   * @returns {Promise<boolean>} if was added or not.
   */
  async addNodeUnstakeTransaction(nodeUnstakeTxHash, emailData) {
    const pocketTransaction = new PocketTransaction(new Date(), nodeUnstakeTxHash, new TransactionPostAction(POST_ACTION_TYPE.unstakeNode, emailData));

    let saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      saved = await CRON_SERVICE.addNodeUnstakeTransaction(pocketTransaction);
    }

    return saved;
  }

  /**
   * Add unjail transaction.
   *
   * @param {string} nodeUnJailTxHash The transaction hash for the submitted app unstake transaction.
   * @param {object} emailData Data to submit unstake email.
   * @param {string} emailData.userName User that owns the application.
   * @param {string} emailData.contactEmail User that owns the application.
   * @param {object} emailData.nodeData Application information.
   * @param {string} emailData.nodeData.name Name of the application.
   * @param {string} emailData.nodeData.link Link to the application.
   *
   * @returns {Promise<boolean>} if was added or not.
   */
  async addNodeUnJailTransaction(nodeUnJailTxHash, emailData) {
    const pocketTransaction = new PocketTransaction(new Date(), nodeUnJailTxHash, new TransactionPostAction(POST_ACTION_TYPE.unjailNode, emailData));

    let saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      saved = await CRON_SERVICE.addNodeUnjailTransaction(pocketTransaction);
    }

    return saved;
  }

  /**
   * Mark transaction as success.
   *
   * @param {PocketTransaction} transaction transaction.
   */
  async markTransactionSuccess(transaction) {
    //
    transaction.completed = true;

    return await this.__updateTransaction(transaction);
  }
}
