import PersistenceProvider from "../providers/data/PersistenceProvider";

export default class BaseService {
  constructor() {
    /** @protected */
    this._persistenceService = new PersistenceProvider();
  }
}
