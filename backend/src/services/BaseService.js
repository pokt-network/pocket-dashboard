import PersistenceProvider from "../providers/data/PersistenceProvider";
import PocketService, {get_default_pocket_network} from "./PocketService";

export default class BaseService {
  constructor() {
    this.persistenceService = new PersistenceProvider();
    this.pocketService = new PocketService(get_default_pocket_network());
  }
}
