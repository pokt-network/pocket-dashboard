import express from "express";
import NodeService from "../services/NodeService";
import {getOptionalQueryOption, getQueryOption} from "./_helpers";
import PaymentService from "../services/PaymentService";
import EmailService from "../services/EmailService";

const router = express.Router();

const nodeService = new NodeService();
const paymentService = new PaymentService();

/**
 * Create new node.
 */
router.post("", async (request, response) => {
  try {
    /** @type {{node: {name:string, contactEmail:string, user:string, owner:string, description:string, icon:string}, privateKey?:string, nodeBaseLink:string}} */
    let data = request.body;

    if (!("privateKey" in data)) {
      data["privateKey"] = "";
    }

    const node = await nodeService.createNode(data.node, data.privateKey);
    const emailAction = data.privateKey ? "imported" : "created";
    const nodeEmailData = {
      name: data.node.name,
      link: `${data.nodeBaseLink}/${node.privateNodeData.address}`
    };

    await EmailService.to(data.node.contactEmail).sendCreateOrImportNodeEmail(emailAction, data.node.user, nodeEmailData);

    response.send(node);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Update a node.
 */
router.put("/:nodeAccountAddress", async (request, response) => {
  try {
    /** @type {{name:string, contactEmail:string, user:string, operator:string, description:string, icon:string}} */
    let data = request.body;

    /** @type {{nodeAccountAddress: string}} */
    const params = request.params;

    const updated = await nodeService.updateNode(params.nodeAccountAddress, data);

    response.send(updated);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Import node from network.
 */
router.get("import/:nodeAccountAddress", async (request, response) => {
  try {
    /** @type {{nodeAccountAddress:string}} */
    const data = request.params;
    const node = await nodeService.importNode(data.nodeAccountAddress);

    response.send(node);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Delete a node from dashboard.
 */
router.post("/:nodeAccountAddress", async (request, response) => {
  try {

    /** @type {{nodeAccountAddress:string}} */
    const data = request.params;
    /** @type {{user:string, nodesLink:string}} */
    const bodyData = request.body;

    const node = await nodeService.deleteNode(data.nodeAccountAddress, bodyData.user);

    if (node) {
      const nodeEmailData = {
        name: node.name,
        nodesLink: bodyData.nodesLink
      };

      await EmailService.to(bodyData.user).sendNodeDeletedEmail(bodyData.user, nodeEmailData);
    }

    response.send(node !== undefined);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Get node that is already on dashboard by address.
 */
router.get("/:nodeAccountAddress", async (request, response) => {
  try {
    /** @type {{nodeAccountAddress:string}} */
    const data = request.params;
    const node = await nodeService.getNode(data.nodeAccountAddress);

    response.send(node);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});


/**
 * Get all nodes.
 */
router.get("", async (request, response) => {
  try {

    const limit = parseInt(getQueryOption(request, "limit"));

    const offsetData = getOptionalQueryOption(request, "offset");
    const offset = offsetData !== "" ? parseInt(offsetData) : 0;

    const statusData = getOptionalQueryOption(request, "status");
    const stakingStatus = statusData !== "" ? parseInt(statusData) : undefined;

    const nodes = await nodeService.getAllNodes(limit, offset, stakingStatus);

    response.send(nodes);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Get all user nodes.
 */
router.post("/user", async (request, response) => {
  try {

    const limit = parseInt(getQueryOption(request, "limit"));

    const offsetData = getOptionalQueryOption(request, "offset");
    const offset = offsetData !== "" ? parseInt(offsetData) : 0;

    const statusData = getOptionalQueryOption(request, "status");
    const stakingStatus = statusData !== "" ? parseInt(statusData) : undefined;

    /** @type {{user: string}} */
    const data = request.body;

    const nodes = await nodeService.getUserNodes(data.user, limit, offset, stakingStatus);

    response.send(nodes);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Stake a node.
 */
router.post("/stake", async (request, response) => {
  try {

    /** @type {{node: {privateKey: string, networkChains: string[], serviceURL: string}, payment:{id: string}}} */
    const data = request.body;
    const paymentHistory = await paymentService.getPaymentFromHistory(data.payment.id);

    if (paymentHistory.isSuccessPayment(true)) {

      if (paymentHistory.isNodePaymentItem(true)) {
        const item = paymentHistory.getItem();
        const staked = await nodeService.stakeNode(data.node, item.pokt);

        response.send(staked);
      }
    }
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * Unstake a node.
 */
router.post("/unstake", async (request, response) => {
  try {

    /** @type {{nodeAccountAddress: string}} */
    const data = request.body;

    const unstaked = await nodeService.unstakeNode(data.nodeAccountAddress);

    response.send(unstaked);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});

/**
 * UnJail a node.
 */
router.post("/unjail", async (request, response) => {
  try {

    /** @type {{nodeAccountAddress: string}} */
    const data = request.body;

    const unJailed = await nodeService.unJailNode(data.nodeAccountAddress);

    response.send(unJailed);
  } catch (e) {
    const error = {
      message: e.toString()
    };

    response.status(400).send(error);
  }
});


export default router;
