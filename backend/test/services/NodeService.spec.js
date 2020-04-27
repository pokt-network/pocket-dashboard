import {before, describe, it} from "mocha";
import "chai/register-should";
import NodeService from "../../src/services/NodeService";
import {PrivatePocketAccount} from "../../src/models/Account";
import {Node, StakingStatus} from "@pokt-network/pocket-js";
import {configureTestService} from "../setupTests";
import {PocketNode} from "../../src/models/Node";

const nodeService = new NodeService();

before(() => {
  configureTestService(nodeService);
});

describe("NodeService", () => {

  describe("createNode", () => {
    it("Expect node successfully created", async () => {
      const data = {
        name: "Test node",
        operator: "Tester",
        contactEmail: "tester@node.com",
        user: "tester@node.com",
        description: "A test node"
      };

      /** @type {{privateNodeData: PrivatePocketAccount, networkData:Node}} */
      const nodeResult = await nodeService.createNode(data);

      // eslint-disable-next-line no-undef
      should.exist(nodeResult);
      // eslint-disable-next-line no-undef
      should.exist(nodeResult.privateNodeData.address);
      // eslint-disable-next-line no-undef
      should.exist(nodeResult.privateNodeData.privateKey);

      nodeResult.privateNodeData.address.length.should.be.equal(40);
      nodeResult.privateNodeData.privateKey.length.should.be.equal(128);

      nodeResult.networkData.stakedTokens.toString().should.be.equal("0");
      nodeResult.networkData.jailed.should.be.equal(false);
      nodeResult.networkData.status.should.be.equal(StakingStatus.Unstaked);
    });
  });

  describe("nodeExists", () => {
    it("Expect a true value", async () => {

      const nodeData = {
        name: "Test node",
        operator: "Tester",
        contactEmail: "tester@node.com",
        user: "tester@node.com",
        description: "A test node"
      };

      const node = PocketNode.createPocketNode(nodeData);
      const exists = await nodeService.nodeExists(node);

      exists.should.be.equal(true);
    });
  });
});
