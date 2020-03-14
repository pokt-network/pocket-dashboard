import PersistenceProvider from "../providers/data/PersistenceProvider";

class BaseService {
  constructor() {
    this._persistenceService = new PersistenceProvider();
  }
}

export default BaseService;
