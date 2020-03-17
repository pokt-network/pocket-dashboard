import PersistenceProvider from "../providers/data/PersistenceProvider";

class BaseService {
  constructor() {
    /** @protected */
    this._persistenceService = new PersistenceProvider();
  }
}

export default BaseService;
