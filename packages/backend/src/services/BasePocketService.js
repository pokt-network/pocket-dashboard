import BaseService from "./BaseService";
import PocketService from "./PocketService";
import TransactionService from "./TransactionService";
import bigInt from "big-integer";

/**
 * @abstract
 */
export default class BasePocketService extends BaseService {
  constructor() {
    super();
    this.pocketService = new PocketService();
    this.transactionService = new TransactionService();
  }

  /**
   * Get Average data from network information.
   *
   * @param {*} data Data.
   *
   * @returns {*} The average data.
   * @protected
   */
  _getAverageNetworkData(data) {
    return data
      .reduce((a, b) => a.add(b), bigInt.zero)
      .divide(bigInt(data.length));
  }

  /**
   * Get Total data from network information.
   *
   * @param {*} data Data.
   *
   * @returns {*} The total data.
   * @protected
   */
  _getTotalNetworkData(data) {
    return data.reduce((a, b) => a.add(b), bigInt.zero);
  }
}
