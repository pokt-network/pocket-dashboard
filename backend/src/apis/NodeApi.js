import express from "express";
import NodeService from "../services/NodeService";
import {apiAsyncWrapper, getOptionalQueryOption, getQueryOption} from "./_helpers";
import PaymentService from "../services/PaymentService";
import EmailService from "../services/EmailService";
import NodeCheckoutService from "../services/checkout/NodeCheckoutService";

const router = express.Router();

const nodeService = new NodeService();
const paymentService = new PaymentService();
const nodeCheckoutService = NodeCheckoutService.getInstance();

/**
 * Create new node.
 */
router.post("", apiAsyncWrapper(async (req, res) => {
  /** @type {{node: {name:string, contactEmail:string, user:string, owner:string, description:string, icon:string}}} */
  const data = req.body;

  const nodeID = await nodeService.createNode(data.node);

  res.send(nodeID);
}));

/**
 * Save node account.
 */
router.post("/account", apiAsyncWrapper(async (req, res) => {
  /** @type {{nodeID: string, nodeData: {address: string, publicKey: string}, nodeBaseLink:string, ppkData?: object}} */
  const data = req.body;

  const node = await nodeService.createNodeAccount(data.nodeID, data.nodeData);

  const emailAction = data.ppkData ? "imported" : "created";
  const nodeEmailData = {
    name: node.name,
    link: `${data.nodeBaseLink}/${data.nodeData.address}`
  };

  await EmailService
    .to(node.contactEmail)
    .sendCreateOrImportNodeEmail(emailAction, node.contactEmail, nodeEmailData);

  res.json(node);
}));

/**
 * Update a node.
 */
router.put("/:nodeAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{name:string, operator:string, contactEmail:string, user:string, description:string, icon:string}} */
  let data = req.body;

  /** @type {{nodeAccountAddress: string}} */
  const params = req.params;

  const updated = await nodeService.updateNode(params.nodeAccountAddress, data);

  res.send(updated);
}));

/**
 * Import node from network.
 */
router.get("import/:nodeAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{nodeAccountAddress:string}} */
  const data = req.params;
  const node = await nodeService.importNode(data.nodeAccountAddress);

  res.json(node);
}));

/**
 * Delete a node from dashboard.
 */
router.post("/:nodeAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{nodeAccountAddress:string}} */
  const data = req.params;
  /** @type {{user:string, nodesLink:string}} */
  const bodyData = req.body;

  const node = await nodeService.deleteNode(data.nodeAccountAddress, bodyData.user);

  if (node) {
    const nodeEmailData = {
      name: node.name,
      nodesLink: bodyData.nodesLink
    };

    await EmailService
      .to(node.contactEmail)
      .sendNodeDeletedEmail(node.contactEmail, nodeEmailData);
  }

  res.send(node !== undefined);
}));

/**
 * Get node that is already on dashboard by address.
 */
router.get("/:nodeAccountAddress", apiAsyncWrapper(async (req, res) => {
  /** @type {{nodeAccountAddress:string}} */
  const data = req.params;
  const node = await nodeService.getNode(data.nodeAccountAddress);

  res.json(node);
}));

/**
 * Get staked summary data.
 */
router.get("/summary/staked", apiAsyncWrapper(async (req, res) => {
  const summaryData = await nodeService.getStakedNodeSummary();

  res.json(summaryData);
}));


/**
 * Get all nodes.
 */
router.get("", apiAsyncWrapper(async (req, res) => {
  const limit = parseInt(getQueryOption(req, "limit"));

  const offsetData = getOptionalQueryOption(req, "offset");
  const offset = offsetData !== "" ? parseInt(offsetData) : 0;

  const nodes = await nodeService.getAllNodes(limit, offset);

  res.json(nodes);
}));

/**
 * Get all user nodes.
 */
router.post("/user/all", apiAsyncWrapper(async (req, res) => {
  const limit = parseInt(getQueryOption(req, "limit"));

  const offsetData = getOptionalQueryOption(req, "offset");
  const offset = offsetData !== "" ? parseInt(offsetData) : 0;

  /** @type {{user: string}} */
  const data = req.body;

  const nodes = await nodeService.getUserNodes(data.user, limit, offset);

  res.json(nodes);
}));

/**
 * Stake a node.
 */
router.post("/custom/stake", apiAsyncWrapper(async (req, res) => {
  /** @type {{transactionHash: string, nodeLink: string}} */
  const data = req.body;

  const paymentHistory = await paymentService.getPaymentFromHistory(data.payment.id);

  if (paymentHistory.isSuccessPayment(true)) {

    if (paymentHistory.isNodePaymentItem(true)) {
      const item = paymentHistory.getItem();
      const amountToSpent = nodeCheckoutService.getMoneyToSpent(parseInt(item.validatorPower));
      const poktToStake = nodeCheckoutService.getPoktToStake(amountToSpent);

      const node = await nodeService.stakeNode(data.transactionHash);

      // TODO: Move this triggers.
      // if (node) {
      //   const nodeEmailData = {
      //     name: node.name,
      //     link: data.nodeLink
      //   };
      //
      //   const paymentEmailData = {
      //     amountPaid: paymentHistory.amount,
      //     validatorPowerAmount: item.validatorPower,
      //     poktStaked: nodeCheckoutService.getPoktToStake(amountToSpent, CoinDenom.Pokt).toString()
      //   };
      //
      //   await EmailService
      //     .to(node.contactEmail)
      //     .sendStakeNodeEmail(node.contactEmail, nodeEmailData, paymentEmailData);
      //
      //   res.send(true);
      // }
    }
  }
  // noinspection ExceptionCaughtLocallyJS
  throw new Error("Error has occurred trying to stake node.");
}));

/**
 * Unstake a node.
 */
router.post("/custom/unstake", apiAsyncWrapper(async (req, res) => {
  /** @type {{transactionHash: string, nodeLink: string}} */
  const data = req.body;

  const node = await nodeService.unstakeNode(data.transactionHash);

  // TODO: Move this triggers.
  // if (node) {
  //   const nodeEmailData = {
  //     name: node.name,
  //     link: data.nodeLink
  //   };
  //
  //   await EmailService
  //     .to(node.contactEmail)
  //     .sendUnstakeNodeEmail(node.contactEmail, nodeEmailData);
  //
  //   res.send(true);
  // } else {
  //   res.send(false);
  // }
}));

/**
 * UnJail a node.
 */
router.post("/unjail", apiAsyncWrapper(async (req, res) => {
  /** @type {{transactionHash: string, nodeLink: string}} */
  const data = req.body;

  const node = await nodeService.unJailNode(data.transactionHash);

  // TODO: Move this triggers.
  // if (node) {
  //   const nodeEmailData = {
  //     name: node.name,
  //     link: data.nodeLink
  //   };
  //
  //   await EmailService
  //     .to(node.contactEmail)
  //     .sendNodeUnJailedEmail(node.contactEmail, nodeEmailData);
  //
  //   res.send(true);
  // } else {
  //   res.send(false);
  // }
}));


export default router;
