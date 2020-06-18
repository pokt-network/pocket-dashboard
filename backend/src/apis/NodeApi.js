import express from "express";
import NodeService from "../services/NodeService";
import {apiAsyncWrapper, getOptionalQueryOption, getQueryOption} from "./_helpers";
import PaymentService from "../services/PaymentService";
import EmailService from "../services/EmailService";
import NodeCheckoutService from "../services/checkout/NodeCheckoutService";
import { CoinDenom } from "@pokt-network/pocket-js"

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
  /** @type {{nodeStakeTransaction: {address: string, raw_hex_bytes: string}, payment:{id: string}, nodeLink: string}} */
  const data = req.body;
  const paymentHistory = await paymentService.getPaymentFromHistory(data.payment.id);

  if (
    paymentHistory.isSuccessPayment(true) &&
    paymentHistory.isNodePaymentItem(true)
  ) {
    // Call NodeService to stake the application
    const nodeAddress = data.nodeStakeTransaction.address;
    const node = await nodeService.getNode(nodeAddress, true);
    const nodeStakeTransaction = data.nodeStakeTransaction;
    const item = paymentHistory.getItem();
    const amountToSpend = nodeCheckoutService.getMoneyToSpent(parseInt(item.validatorPower));
    const poktStaked = nodeCheckoutService.getPoktToStake(amountToSpend, CoinDenom.Pokt).toString();
    const uPoktStaked = nodeCheckoutService.getPoktToStake(amountToSpend, CoinDenom.Upokt).toString();

    const nodeEmailData = {
      name: node.pocketNode.name,
      link: data.nodeLink
    };

    const paymentEmailData = {
      amountPaid: paymentHistory.amount,
      validatorPowerAmount: item.validatorPower,
      poktStaked: poktStaked
    };

    await nodeService.stakeNode(nodeAddress, uPoktStaked, nodeStakeTransaction, node, nodeEmailData, paymentEmailData);
    res.send(true);
  } else {
    // Return error if payment was unsuccesful
    throw new Error("Error processing payment, please try a different method");
  }
}));

/**
 * Unstake a node.
 */
router.post("/custom/unstake", apiAsyncWrapper(async (req, res) => {
  /** @type {{nodeUnstakeTranaction: {address: string, raw_hex_bytes: string}, nodeLink: string}} */
  const data = req.body;
  const {
    nodeUnstakeTranaction,
    nodeLink
  } = data;

  // Submit Unstake transaction to the pocket network
  await nodeService.unstakeNode(nodeUnstakeTranaction, nodeLink);

  // Respond
  res.send(true);
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
