class PersistenceService {
  constructor(dbProvider) {
    this._dbProvider = dbProvider;
  }

  openConnection(callback, errorCallback) {
    if (!this._dbProvider.isOpen()) {
      this._dbProvider.open((err) => {
        if (!err) {
          const db = this._dbProvider.getDB();

          callback(db);
          this.closeConnection();
        } else {
          errorCallback(err);
        }
      });
    }
  }

  closeConnection(callback) {
    this._dbProvider.close(callback);
  }

  getElementByID(entity, callback) {
    this.openConnection((db) => {
    });
  }

  getElements(entity, query, callback) {
    this.openConnection((db) => {

    });
  }

  saveEntity(entity, callback) {
    this.openConnection((db) => {

    });
  }

  deleteEntityByID(entity, callback) {
    this.openConnection((db) => {

    });
  }

}

export default PersistenceService
