import express from "express";
import NodeService from "../services/NodeService";

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


export default router;
