import express from "express";
import NodeService from "../services/NodeService";
import {getOptionalQueryOption, getQueryOption} from "./_helpers";

const router = express.Router();

const nodeService = new NodeService();

/**
 * Create new node.
 */
router.post("", async (request, response) => {
  try {
    /** @type {{node: {name:string, contactEmail:string, user:string, owner:string, description:string, icon:string}, privateKey?:string}} */
    let data = request.body;

    if (!("privateKey" in data)) {
      data["privateKey"] = "";
    }

    const node = await nodeService.createNode(data.node, data.privateKey);

    response.send(node);
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


export default router;
