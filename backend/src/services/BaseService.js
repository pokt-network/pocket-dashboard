import PersistenceProvider from "../providers/data/PersistenceProvider";
import PocketService, {get_default_pocket_network} from "./PocketService";

export default class BaseService {
  constructor() {
    const pocketData = get_default_pocket_network();

    this.persistenceService = new PersistenceProvider();
    this.pocketService = new PocketService(pocketData.nodes, pocketData.rpcProvider);
  }
}
