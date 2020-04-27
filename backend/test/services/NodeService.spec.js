import {before, describe, it} from "mocha";
import "chai/register-should";
import NodeService from "../../src/services/NodeService";
import {PrivatePocketAccount} from "../../src/models/Account";
import {Node, StakingStatus} from "@pokt-network/pocket-js";
import {configureTestService} from "../setupTests";
import {PocketNode} from "../../src/models/Node";
import {assert, expect} from "chai";

const nodeService = new NodeService();

/** @type {string} */
const NODE_PRIVATE_KEY_ON_NETWORK = process.env.TEST_NODE_PRIVATE_KEY_ON_NETWORK;

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

  if (NODE_PRIVATE_KEY_ON_NETWORK) {
    describe("importNode", () => {
      it("Expect an node network data", async () => {

        const applicationNetworkData = await nodeService.importNode(NODE_PRIVATE_KEY_ON_NETWORK);

        // eslint-disable-next-line no-undef
        should.exist(applicationNetworkData);

        applicationNetworkData.should.be.an("object");
      });
    });
  }

  describe("importNode with invalid address", () => {
    it("Expect an error", async () => {

      try {
        await nodeService.importNode("NOT_VALID_ADDRESS");
        assert.fail();
      } catch (e) {
        expect(e.message).to.be.equal("Invalid Address Hex");
      }
    });
  });
});
