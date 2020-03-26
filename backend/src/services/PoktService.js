import {Account, Configuration, HttpRpcProvider, Pocket} from "@pokt-network/pocket-js";
import {PocketAAT} from "@pokt-network/aat-js";
import {Configurations} from "../_configuration";
import assert from "assert";

const POKT_NETWORK_CONFIGURATION = Configurations.poktNetwork;

const POKT_CONFIGURATION = new Configuration(
  POKT_NETWORK_CONFIGURATION.max_dispatchers, POKT_NETWORK_CONFIGURATION.request_timeout, POKT_NETWORK_CONFIGURATION.max_sessions);


/**
 * Convert list of string nodes to URL nodes.
 *
 * @param {[string]} nodes List of nodes of Pokt network.
 *
 * @returns {URL[]} Nodes urls.
 */
function getNodeURLS(nodes) {
  assert.notEqual(null, nodes);

  return nodes.map((node) => {
    const nodeURL = node + ":" + POKT_NETWORK_CONFIGURATION.default_rpc_port;

    return new URL(nodeURL);
  });
}


/**
 * Get RPC dispatcher provider using a Pokt network node.
 *
 * @param {string} node Node used to RPC dispatcher provider.
 *
 * @returns {HttpRpcProvider} The main rpc provider in the node.
 */
function getRPCDispatcher(node) {
  assert.notEqual(null, node);

  return new HttpRpcProvider(new URL(node));
}

/**
 * Get the default pokt network nodes.
 *
 * @returns {string[]} List of default nodes.
 */
export function get_default_pokt_network() {
  return POKT_NETWORK_CONFIGURATION.nodes.main;
}

export default class PoktService {

  /**
   * @param {string[]} nodes List of nodes of Pokt network.
   */
  constructor(nodes) {
    this.__pocket = new Pocket(getNodeURLS(nodes), getRPCDispatcher(nodes[0]), POKT_CONFIGURATION);
  }


  /**
   * Create account on Pokt network.
   *
   * @param {string} passphrase Passphrase used to generate account.
   *
   * @returns {Promise<Account | Error>} A pocket account.
   */
  async createAccount(passphrase) {
    return this.__pocket.keybase.createAccount(passphrase);
  }

  /**
   * Retrieve account from network.
   *
   * @param {string} addressHex Address of account to retrieve in hex.
   *
   * @returns {Promise<Account | Error>} A pocket account.
   */
  async getAccount(addressHex) {
    return this.__pocket.keybase.getAccount(addressHex);
  }

  /**
   * Import an account to Pokt network using private key of the account.
   *
   * @param {string} privateKeyHex Private key of the account to import in hex.
   * @param {string} passphrase Passphrase used to generate the account.
   *
   * @returns {Promise<Account | Error>} A pocket account.
   */
  async importAccount(privateKeyHex, passphrase) {
    return this.__pocket.keybase.importAccount(Buffer.from(privateKeyHex, "hex"), passphrase);
  }

  /**
   * Export Private key of the account.
   *
   * @param {string} addressHex Address of account to export in hex.
   * @param {string} passphrase Passphrase used to generate the account.
   *
   * @returns {Promise<Buffer | Error>} A buffer of private key.
   */
  async exportAccount(addressHex, passphrase) {
    return this.__pocket.keybase.exportAccount(addressHex, passphrase);
  }

  /**
   * Export raw Private key of the account.
   *
   * @param {string} addressHex Address of account to export in hex.
   * @param {string} passphrase Passphrase used to generate the account.
   * @param {string} encoding Encoding used to encode the buffer of private key.
   *
   * @returns {Promise<string>} A Hex private key.
   */
  async exportRawAccount(addressHex, passphrase, encoding = "hex") {
    /** @type {Buffer} */
    const privateKey = await this.__pocket.keybase.exportAccount(addressHex, passphrase);

    return privateKey.toString(encoding);
  }

  /**
   * Get an Application Authentication Token to be used on Pokt network.
   *
   * @param {Account} clientAccount The client Pokt account our dApp is connecting to.
   * @param {Account} applicationAccount The funded applications Pokt account address.
   * @param {string} applicationAccountPassphrase The passphrase used to generate application address.
   *
   * @returns {Promise<PocketAAT>} An application authorization tokens.
   */
  async getApplicationAuthenticationToken(clientAccount, applicationAccount, applicationAccountPassphrase) {
    const aatVersion = POKT_NETWORK_CONFIGURATION.aat_version;

    const clientPublicKey = clientAccount.publicKey.toString("hex");
    const applicationPublicKeyHex = applicationAccount.publicKey.toString("hex");
    const applicationPrivateKeyHex = await this.exportRawAccount(applicationAccount.addressHex, applicationAccountPassphrase);

    return PocketAAT.from(aatVersion, clientPublicKey, applicationPublicKeyHex, applicationPrivateKeyHex);
  }

}
