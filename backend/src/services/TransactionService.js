import BaseService from "./BaseService";
import {PocketTransaction, TransactionPostAction} from "../models/Transaction";

import JobService from "bull";
import {Configurations} from "../_configuration";

const PENDING_TRANSACTION_COLLECTION_NAME = "PendingTransactions";

const POST_TRANSFER_QUEUE = new JobService("POST_TRANSFER_QUEUE");
const STAKE_QUEUE = new JobService("STAKE_QUEUE");
const UNSTAKE_QUEUE = new JobService("UNSTAKE_QUEUE");
const UNJAIL_QUEUE = new JobService("UNJAIL_QUEUE");

const {
  jobs: {
    delayed_time: DELAYED_TIME,
    ATTEMPTS
  }
} = Configurations.pocket_network;

const JOB_CONFIGURATION = {delay: DELAYED_TIME, attempts: ATTEMPTS, backoff: DELAYED_TIME};

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
      POST_TRANSFER_QUEUE.add(pocketTransaction, JOB_CONFIGURATION);
    }

    return saved;
  }

  /**
   * Add stake transaction.
   *
   * @param {string} transactionHash Transaction hash.
   *
   * @returns {Promise<boolean>} if was added or not.
   */
  async addStakeTransaction(transactionHash) {
    const pocketTransaction = new PocketTransaction(new Date(), transactionHash);

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      STAKE_QUEUE.add(pocketTransaction, JOB_CONFIGURATION);
    }

    return saved;
  }

  /**
   * Add unstake transaction.
   *
   * @param {string} transactionHash Transaction hash.
   *
   * @returns {Promise<boolean>} if was added or not.
   */
  async addUnstakeTransaction(transactionHash) {
    const pocketTransaction = new PocketTransaction(new Date(), transactionHash);

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      UNSTAKE_QUEUE.add(pocketTransaction, JOB_CONFIGURATION);
    }

    return saved;
  }

  /**
   * Add un jail transaction.
   *
   * @param {string} transactionHash Transaction hash.
   *
   * @returns {Promise<boolean>} if was added or not.
   */
  async addUnJailTransaction(transactionHash) {
    const pocketTransaction = new PocketTransaction(new Date(), transactionHash);

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      UNJAIL_QUEUE.add(pocketTransaction, JOB_CONFIGURATION);
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
