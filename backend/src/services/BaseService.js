import PersistenceProvider from "../providers/data/PersistenceProvider";
import PoktService, {get_default_pokt_network} from "./PoktService";

export default class BaseService {
  constructor() {
    /** @protected */
    this._persistenceService = new PersistenceProvider();

    /** @protected */
    this._poktService = new PoktService(get_default_pokt_network());
  }
}
