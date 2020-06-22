import BaseService from "./BaseService";
import {PocketTransaction, POST_ACTION_TYPE, TransactionPostAction} from "../models/Transaction";
import JobsProvider from "../providers/data/JobsProvider";

const PENDING_TRANSACTION_COLLECTION_NAME = "PendingTransactions";

const POST_TRANSFER_QUEUE = JobsProvider.getPostTransferJobQueue();
const APP_STAKE_QUEUE = JobsProvider.getAppStakeJobQueue();
const APP_UNSTAKE_QUEUE = JobsProvider.getAppUnstakeJobQueue();
const NODE_STAKE_QUEUE = JobsProvider.getNodeStakeJobQueue();
const NODE_UNSTAKE_QUEUE = JobsProvider.getNodeUnstakeJobQueue();

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
   *
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
   * Add stake transaction.
   *
   * @param {string} nodeStakeTxHash The transaction hash for the submitted app stake transaction
   * @param {{nodeStakeTransaction: object, contactEmail: string, emailData: object, paymentEmailData: object}} nodeStakeData Node Stake Data
   * @returns {Promise<boolean>} if was added or not.
   */
  async addNodeStakeTransaction(nodeStakeTxHash, nodeStakeData) {
    const pocketTransaction = new PocketTransaction(new Date(), nodeStakeTxHash, new TransactionPostAction(POST_ACTION_TYPE.stakeNode, nodeStakeData));

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      JobsProvider.addJob(NODE_STAKE_QUEUE, pocketTransaction);
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

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      JobsProvider.addJob(APP_UNSTAKE_QUEUE, pocketTransaction);
    }

    return saved;
  }

  /**
   * Add unstake transaction.
   *
   * @param {string} nodeUnstakeTxHash The transaction hash for the submitted app unstake transaction.
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

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      JobsProvider.addJob(NODE_UNSTAKE_QUEUE, pocketTransaction);
    }

    return saved;
  }

  /**
   * Mark transaction as success.
   *
   * @param {PocketTransaction} transaction transaction.
   */
  async markTransactionSuccess(transaction) {
    await this.__updateTransaction(transaction);
  }
}
