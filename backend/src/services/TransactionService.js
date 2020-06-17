import BaseService from "./BaseService";
import { PocketTransaction, TransactionPostAction, POST_ACTION_TYPE } from "../models/Transaction";
import JobsProvider from "../providers/data/JobsProvider";

const PENDING_TRANSACTION_COLLECTION_NAME = "PendingTransactions";

const POST_TRANSFER_QUEUE = JobsProvider.getPostTransferJobQueue();
const APP_STAKE_QUEUE = JobsProvider.getAppStakeJobQueue();
const APP_UNSTAKE_QUEUE = JobsProvider.getAppUnstakeJobQueue();
// const STAKE_QUEUE = JobsProvider.getStakeJobQueue();
// const UNSTAKE_QUEUE = JobsProvider.getUnStakeJobQueue();
// const UNJAIL_QUEUE = JobsProvider.getUnJailJobQueue();

/**
 * @deprecated This logic will be moved soon.
 */
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

    await this.persistenceService.deleteEntities(PENDING_TRANSACTION_COLLECTION_NAME, filter);
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

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved && postAction) {
      JobsProvider.addJob(POST_TRANSFER_QUEUE, pocketTransaction);
    }

    return saved;
  }

  /**
   * Add stake transaction.
   * @param {string} appStakeTxHash The transaction hash for the submitted app stake transaction
   * @param {{appStakeTransaction: object, contactEmail: string, emailData: object, paymentEmailData: object}} appStakeData App Stake Data
   * @returns {Promise<boolean>} if was added or not.
   */
  async addAppStakeTransaction(appStakeTxHash, appStakeData) {
    const pocketTransaction = new PocketTransaction(new Date(), appStakeTxHash, new TransactionPostAction(POST_ACTION_TYPE.stakeApplication, appStakeData));

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      JobsProvider.addJob(APP_STAKE_QUEUE, pocketTransaction);
    }

    return saved;
  }

  /**
   * Add unstake transaction.
   * @param {string} appUnstakeTxHash The transaction hash for the submitted app unstake transaction
   * @param {object} emailData Data to submit unstake email
   * @param {string} emailData.userName User that owns the application
   * @param {string} emailData.contactEmail User that owns the application
   * @param {object} emailData.applicationData Application information
   * @param {string} emaildata.applicationData.name Name of the application
   * @param {string} emaildata.applicationData.link Link to the application
   * @returns {Promise<boolean>} if was added or not.
   */
  async addAppUnstakeTransaction(appUnstakeTxHash, emailData) {
    const pocketTransaction = new PocketTransaction(new Date(), appUnstakeTxHash, new TransactionPostAction(POST_ACTION_TYPE.unstakeApplication, emailData));

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      JobsProvider.addJob(APP_UNSTAKE_QUEUE, pocketTransaction);
    }

    return saved;
  }

  // /**
  //  * Add unstake transaction.
  //  *
  //  * @param {string} transactionHash Transaction hash.
  //  *
  //  * @returns {Promise<boolean>} if was added or not.
  //  */
  // async addUnstakeTransaction(transactionHash) {
  //   const pocketTransaction = new PocketTransaction(new Date(), transactionHash);

  //   const saved = await this.__addTransaction(pocketTransaction);

  //   if (saved) {
  //     JobsProvider.addJob(UNSTAKE_QUEUE, pocketTransaction);
  //   }

  //   return saved;
  // }

  // /**
  //  * Add un jail transaction.
  //  *
  //  * @param {string} transactionHash Transaction hash.
  //  *
  //  * @returns {Promise<boolean>} if was added or not.
  //  */
  // async addUnJailTransaction(transactionHash) {
  //   const pocketTransaction = new PocketTransaction(new Date(), transactionHash);

  //   const saved = await this.__addTransaction(pocketTransaction);

  //   if (saved) {
  //     JobsProvider.addJob(UNJAIL_QUEUE, pocketTransaction);
  //   }

  //   return saved;
  // }

  /**
   * Mark transaction as success.
   *
   * @param {PocketTransaction} transaction transaction.
   */
  async markTransactionSuccess(transaction) {
    await this.__updateTransaction(transaction);
  }

  /**
   * Check if a transaction is succesful
   */
}
