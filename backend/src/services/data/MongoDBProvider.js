import {MongoClient} from "mongodb";

class MongoDBProvider {
  constructor(properties) {
    this.properties = properties;
    this.client = new MongoClient(properties.url, properties.options);
  }

  open(callback) {
    this.client.connect(callback);
  }

  isOpen() {
    return this.client.isConnected();
  }

  close(callback) {
    return this.client.close(callback);
  }

  getDB() {
    return this.client.db(this.properties.dbName);
  }

}

export default MongoDBProvider;
