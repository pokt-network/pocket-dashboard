import PersistenceProvider from "../providers/data/PersistenceProvider";
import PocketService, {get_default_pocket_network} from "./PocketService";

export default class BaseService {
  constructor() {
    /** @protected */
    this._persistenceService = new PersistenceProvider();

    /** @protected */
    this._pocketService = new PocketService(get_default_pocket_network());
  }
}
