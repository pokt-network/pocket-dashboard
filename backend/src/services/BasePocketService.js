import BaseService from "./BaseService";
import PocketService, {get_default_pocket_network} from "./PocketService";
import TransactionService from "./TransactionService";

/**
 * @abstract
 */
export default class BasePocketService extends BaseService {

  constructor() {
    super();

    const pocketData = get_default_pocket_network();

    this.pocketService = new PocketService(pocketData.nodes, pocketData.rpcProvider);
    this.transactionService = new TransactionService();
  }
}
