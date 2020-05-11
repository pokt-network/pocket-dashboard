import {before, describe, it} from "mocha";
import "chai/register-should";
import NodeService from "../../src/services/NodeService";
import {PrivatePocketAccount} from "../../src/models/Account";
import {Node, StakingStatus} from "@pokt-network/pocket-js";
import {configureTestService} from "../setupTests";
import {PocketNode} from "../../src/models/Node";
import {assert, expect} from "chai";
import sinon from "sinon";
import PersistenceProvider from "../../src/providers/data/PersistenceProvider";

const nodeService = new NodeService();

/** @type {string} */
const NODE_ACCOUNT_IN_NETWORK = process.env.TEST_NODE_ACCOUNT_IN_NETWORK;

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

      exists.should.be.true;
    });
  });

  describe("updateNode", () => {
    it("Expect a true value", async () => {
      const nodeData = {
        name: "Test node to edit",
        operator: "Tester",
        contactEmail: "tester@node.com",
        user: "tester@node.com",
        description: "A test node"
      };

      const nodeResult = await nodeService.createNode(nodeData);
      const nodeToEdit = {
        ...nodeData,
        name: "To Update"
      };

      const updated = await nodeService.updateNode(nodeResult.networkData.address, nodeToEdit);

      updated.should.be.true;
    });
  });

  describe("deleteNode", () => {
    const address = "bc28256f5c58611e96d13996cf535bdc0204366a";
    const user = "tester@node.com";

    const resultData = {
      result: {
        ok: 1
      }
    };

    it("Expect success", async () => {

      const persistenceService = sinon.createStubInstance(PersistenceProvider);
      const stubFilter = {
        "publicPocketAccount.address": address,
        user
      };

      persistenceService.deleteEntities
        .withArgs("Nodes", stubFilter)
        .returns(Promise.resolve(resultData));

      sinon.stub(nodeService, "persistenceService").value(persistenceService);

      const deleted = await nodeService.deleteNode(address, user);

      // eslint-disable-next-line no-undef
      should.exist(deleted);

      deleted.should.be.true;
    });
  });

  if (NODE_ACCOUNT_IN_NETWORK) {
    describe("importNode", () => {
      it("Expect a node network data", async () => {

        const nodeNetworkData = await nodeService.importNode(NODE_ACCOUNT_IN_NETWORK);

        // eslint-disable-next-line no-undef
        should.exist(nodeNetworkData);

        nodeNetworkData.should.be.an("object");
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

  describe("getNode", () => {
    const address = "bc28256f5c58611e96d13996cf535bdc0204366a";

    const nodeData = {
      name: "Test node 999",
      operator: "Tester",
      contactEmail: "tester@node.com",
      user: "tester@node.com",
      description: "A test node",
      publicPocketAccount: {
        address: address,
        publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
      }
    };

    it("Expect a node", async () => {

      const persistenceService = sinon.createStubInstance(PersistenceProvider);
      const stubFilter = {
        "publicPocketAccount.address": address
      };

      persistenceService.getEntityByFilter
        .withArgs("Nodes", stubFilter)
        .returns(Promise.resolve(nodeData));

      sinon.stub(nodeService, "persistenceService").value(persistenceService);

      const node = await nodeService.getNode(address);

      // eslint-disable-next-line no-undef
      should.exist(node);

      node.should.be.an("object");
    });
  });

  describe("listNodes", () => {
    const user = "tester@node.com";
    const limit = 10;
    const offset = 0;

    const nodeData = [
      {
        name: "Test node 1",
        operator: "Tester",
        contactEmail: "tester@node.com",
        user: "tester@app.com",
        description: "A test node",
        publicPocketAccount: {
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
        }
      },
      {
        name: "Test node 1",
        operator: "Tester",
        contactEmail: "tester@node.com",
        user: "tester@app.com",
        description: "A test node",
        publicPocketAccount: {
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
        }
      },
      {
        name: "Test node 1",
        operator: "Tester",
        contactEmail: "tester@node.com",
        user: "tester@app.com",
        description: "A test node",
        publicPocketAccount: {
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
        }
      },
      {
        name: "Test node 1",
        operator: "Tester",
        contactEmail: "tester@node.com",
        user: "tester@app.com",
        description: "A test node",
        publicPocketAccount: {
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
        }
      },
      {
        name: "Test node 1",
        operator: "Tester",
        contactEmail: "tester@node.com",
        user: "tester@app.com",
        description: "A test node",
        publicPocketAccount: {
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
        }
      }
    ];

    it("Expect a list of nodes", async () => {

      const persistenceService = sinon.createStubInstance(PersistenceProvider);

      persistenceService.getEntities
        .withArgs("Nodes", {}, limit, offset)
        .returns(Promise.resolve(nodeData));

      sinon.stub(nodeService, "persistenceService").value(persistenceService);

      const nodes = await nodeService.getAllNodes(limit, offset);

      // eslint-disable-next-line no-undef
      should.exist(nodes);

      nodes.should.be.an("array");
      nodes.length.should.be.greaterThan(0);
    });

    it("Expect a list of user nodes", async () => {

      const persistenceService = sinon.createStubInstance(PersistenceProvider);

      persistenceService.getEntities
        .withArgs("Nodes", {user: user}, limit, offset)
        .returns(Promise.resolve(nodeData));

      sinon.stub(nodeService, "persistenceService").value(persistenceService);

      const nodes = await nodeService.getUserNodes(user, limit, offset);

      // eslint-disable-next-line no-undef
      should.exist(nodes);

      nodes.should.be.an("array");
      nodes.length.should.be.greaterThan(0);
    });
  });
  // TODO: Add unit test for stake a node.

  // TODO: Add unit test for unstake a node.
});
