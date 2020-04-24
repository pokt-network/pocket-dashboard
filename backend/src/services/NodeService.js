import BaseService from "./BaseService";
import UserService from "./UserService";

const NODE_COLLECTION_NAME = "Nodes";

export default class NodeService extends BaseService {

  constructor() {
    super();

    this.userService = new UserService();
  }
}
