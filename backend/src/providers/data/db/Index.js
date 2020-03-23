import MongoDBAdapter from "./MongoDBAdapter";
import {Configurations} from "../../../_configuration";

const DEFAULT_DB_PROVIDER = new MongoDBAdapter(Configurations.persistence.default);

export function get_default_db_provider() {
  return DEFAULT_DB_PROVIDER;
}
