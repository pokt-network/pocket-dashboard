import {Configuration, HttpRpcProvider, Pocket} from "@pokt-network/pocket-js";
import {PocketAAT} from "@pokt-network/aat-js";
import {configurations} from "../_configuration";
import assert from "assert";

const POKT_NETWORK_CONFIGURATION = configurations.poktNetwork;

const POKT_CONFIGURATION = new Configuration(
  POKT_NETWORK_CONFIGURATION.max_dispatchers,
  POKT_NETWORK_CONFIGURATION.request_timeout,
  POKT_NETWORK_CONFIGURATION.max_sessions);

/**
 * Convert list of string nodes to URL nodes.
 *
 * @param {[string]} nodes List of nodes of Pokt network.
 *
 * @returns {[URL]}
 */
function getNodeURLS(nodes) {
  assert.notEqual(null, nodes);

  return nodes.map((node) => {
    const nodeURL = node + ':' + POKT_NETWORK_CONFIGURATION.default_rpc_port;
    return new URL(nodeURL);
  });
}


/**
 * Get RPC dispatcher provider using a Pokt network node.
 *
 * @param {string} node Node used to RPC dispatcher provider.
 *
 * @returns {HttpRpcProvider}
 */
function getRPCDispatcher(node) {
  assert.notEqual(null, node);

  return new HttpRpcProvider(new URL(node));
}

class PoktService {

  /**
   * @param {[string]} nodes List of nodes of Pokt network.
   */
  constructor(nodes) {
    this.__pocket = new Pocket(getNodeURLS(nodes), getRPCDispatcher(nodes[0]), POKT_CONFIGURATION)
  }


  /**
   * Create account on Pokt network.
   *
   * @param {string} passphrase Passphrase used to generate account.
   *
   * @returns {Promise<Account | Error>}
   */
  async createAccount(passphrase) {
    return this.__pocket.keybase.createAccount(passphrase);
  }

  /**
   * Retrieve account from network.
   *
   * @param {string} addressHex Address of account to retrieve in hex.
   *
   * @returns {Promise<Account | Error>}
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
   * @returns {Promise<Account | Error>}
   */
  async importAccount(privateKeyHex, passphrase) {
    return this.__pocket.keybase.importAccount(Buffer.from(privateKeyHex, 'hex'), passphrase);
  }

  /**
   * Export Private key of the account.
   *
   * @param addressHex Address of account to export in hex.
   * @param passphrase Passphrase used to generate the account.
   *
   * @returns {Promise<Buffer | Error>}
   */
  async exportAccount(addressHex, passphrase) {
    return this.__pocket.keybase.exportAccount(addressHex, passphrase);
  }

  /**
   * Export raw Private key of the account.
   *
   * @param addressHex Address of account to export in hex.
   * @param passphrase Passphrase used to generate the account.
   * @param encoding Encoding used to encode the buffer of private key.
   *
   * @returns {Promise<string>}
   */
  async exportRawAccount(addressHex, passphrase, encoding = 'hex') {
    /** @type Buffer */
    const privateKey = await this.__pocket.keybase.exportAccount(addressHex, passphrase);

    return privateKey.toString(encoding);
  }

  /**
   * Create an Application Authentication Token to be used on Pokt network.
   *
   * @param {Account} clientAccount The client Pokt account our dApp is connecting to.
   * @param {Account} applicationAccount The funded applications Pokt account address.
   * @param {string} applicationAccountPassphrase The passphrase used to generate application address.
   *
   * @returns {Promise<PocketAAT>}
   */
  async createApplicationAuthenticationToken(clientAccount, applicationAccount, applicationAccountPassphrase) {
    const aatVersion = POKT_NETWORK_CONFIGURATION.aat_version;

    const clientPublicKey = clientAccount.publicKey.toString('hex');
    const applicationPublicKeyHex = applicationAccount.publicKey.toString('hex');
    const applicationPrivateKeyHex = await this.exportRawAccount(applicationAccount.addressHex, applicationAccountPassphrase);

    return PocketAAT.from(aatVersion, clientPublicKey, applicationPublicKeyHex, applicationPrivateKeyHex)
  }

}

export default PoktService
