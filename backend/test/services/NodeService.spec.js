import {before} from "mocha";
import "chai/register-should";
import {configureTestService} from "../setupTests";
import NodeService from "../../src/services/NodeService";


const nodeService = new NodeService();

before(() => {
  configureTestService(nodeService);
});
