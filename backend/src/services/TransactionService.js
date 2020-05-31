import BaseService from "./BaseService";
import {PocketTransaction} from "../models/Transaction";

const PENDING_TRANSACTION_COLLECTION_NAME = "PendingTransactions";


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

  async addTransaction(transactionHash, postAction = {}) {
    const pocketTransaction = new PocketTransaction(new Date(), transactionHash, postAction);

    return this.__addTransaction(pocketTransaction);
  }
}
