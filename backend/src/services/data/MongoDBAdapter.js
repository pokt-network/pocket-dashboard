import {MongoClient} from "mongodb";

class MongoDBAdapter {
  constructor(properties) {
    this.properties = properties;
  }

  open() {
    return MongoClient.connect(this.properties.url, this.properties.options);
  }

  close(connection) {
    return connection.close();
  }

  getDB(connection) {
    return connection.db(this.properties.dbName);
  }

}

export default MongoDBAdapter;
