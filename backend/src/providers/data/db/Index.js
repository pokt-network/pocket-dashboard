import MongoDBAdapter from "./MongoDBAdapter";
import {Configurations} from "../../../_configuration";

const DEFAULT_DB_PROVIDER = new MongoDBAdapter(Configurations.persistence.default);

/**
 * @returns {MongoDBAdapter} The default mongo adapter provider.
 */
export function get_default_db_provider() {
  return DEFAULT_DB_PROVIDER;
}
