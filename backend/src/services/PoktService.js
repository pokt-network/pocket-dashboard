import {Configuration, HttpRpcProvider, Pocket} from "@pokt-network/pocket-js";
import {PocketAAT} from "@pokt-network/aat-js";
import {configurations} from "../_configuration";
import assert from "assert";

const POKT_NETWORK_CONFIGURATION = configurations.poktNetwork;

const POKT_CONFIGURATION = new Configuration(
  POKT_NETWORK_CONFIGURATION.max_dispatchers,
  POKT_NETWORK_CONFIGURATION.request_timeout,
  POKT_NETWORK_CONFIGURATION.max_sessions);

function getNodeURLS(nodes) {
  assert.notEqual(null, nodes);

  return nodes.map((node) => {
    const nodeURL = node + ':' + POKT_NETWORK_CONFIGURATION.default_rpc_port;
    return new URL(nodeURL);
  });
}

function getRPCDispatcher(nodes) {
  assert.notEqual(null, nodes);

  return new HttpRpcProvider(new URL(nodes[0]));
}

class PoktService {

  constructor(nodes) {
    this.__pocket = new Pocket(getNodeURLS(nodes), getRPCDispatcher(nodes), POKT_CONFIGURATION)
  }


  async createAccount(passphrase) {
    return this.__pocket.keybase.createAccount(passphrase);
  }

  async getAccount(addressHex) {
    return this.__pocket.keybase.getAccount(addressHex);
  }

  async importAccount(privateKeyHex, passphrase) {
    return this.__pocket.keybase.importAccount(Buffer.from(privateKeyHex, 'hex'), passphrase);
  }

  async exportAccount(addressHex, passphrase) {
    return this.__pocket.keybase.exportAccount(addressHex, passphrase);
  }

  async exportRawAccount(addressHex, passphrase, encoding = 'hex') {
    const privateKey = await this.__pocket.keybase.exportAccount(addressHex, passphrase);

    return privateKey.toString(encoding);
  }

  async createApplicationAuthenticationToken(clientAccount, applicationAccount, applicationPassphrase) {
    const aatVersion = POKT_NETWORK_CONFIGURATION.aat_version;

    const clientPublicKey = clientAccount.publicKey.toString('hex');
    const applicationPublicKeyHex = applicationAccount.publicKey.toString('hex');
    const applicationPrivateKeyHex = await this.exportRawAccount(applicationAccount.addressHex, applicationPassphrase);

    return PocketAAT.from(aatVersion, clientPublicKey, applicationPublicKeyHex, applicationPrivateKeyHex)
  }

}

export default PoktService
