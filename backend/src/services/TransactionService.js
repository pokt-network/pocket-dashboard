import BaseService from "./BaseService";
import {PocketTransaction} from "../models/Transaction";
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
   * @param {PocketTransaction} transaction transaction.
   * @private
   */
  async __addTransaction(transaction) {

    /** @type {{result: {n:number, ok: number}}} */
    const saveResult = await this.persistenceService
      .saveEntity(PENDING_TRANSACTION_COLLECTION_NAME, transaction);

    return saveResult.result.ok === 1;
  }

  /**
   * @param {PocketTransaction} transaction transaction.
   * @private
   */
  async __updateTransaction(transaction) {
    const filter = {
      hash: transaction.hash
    };

    await this.persistenceService.deleteEntities(PENDING_TRANSACTION_COLLECTION_NAME, filter);
  }

  async addTransferTransaction(transactionHash, postAction = {}) {
    const pocketTransaction = new PocketTransaction(new Date(), transactionHash, postAction);

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved && postAction) {
      POST_TRANSFER_QUEUE.add(pocketTransaction, JOB_CONFIGURATION);
    }

    return saved;
  }

  async addStakeTransaction(transactionHash) {
    const pocketTransaction = new PocketTransaction(new Date(), transactionHash);

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      STAKE_QUEUE.add(pocketTransaction, JOB_CONFIGURATION);
    }

    return saved;
  }

  async addUnstakeTransaction(transactionHash) {
    const pocketTransaction = new PocketTransaction(new Date(), transactionHash);

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      UNSTAKE_QUEUE.add(pocketTransaction, JOB_CONFIGURATION);
    }

    return saved;
  }

  async markTransactionSuccess(transaction) {
    await this.__updateTransaction(transaction);
  }

  async addUnJailTransaction(transactionHash) {
    const pocketTransaction = new PocketTransaction(new Date(), transactionHash);

    const saved = await this.__addTransaction(pocketTransaction);

    if (saved) {
      UNJAIL_QUEUE.add(pocketTransaction, JOB_CONFIGURATION);
    }

    return saved;
  }
}
