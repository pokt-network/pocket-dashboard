import Passphrase from "../../../core/components/Passphrase/Passphrase";
import NodeService from "../../../core/services/PocketNodeService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {scrollToId} from "../../../_helpers";
import PocketClientService from "../../../core/services/PocketClientService";
import {Account} from "@pokt-network/pocket-js";

class NodePassphrase extends Passphrase {
  componentDidMount() {
    this.setState({type: "node", fileName: "MyPocketNode"});
  }

  async createAccount() {
    this.setState({loading: true});
    const {id: nodeID} = NodeService.getNodeInfo();
    const {passPhrase} = this.state;

    const nodeAccountOrError = await PocketClientService.createAndUnlockAccount(passPhrase);

    if (nodeAccountOrError instanceof Account) {
      const ppkData = await PocketClientService.createPPKFromPrivateKey(nodeAccountOrError.privateKey.toString("hex"), passPhrase);
      const address = nodeAccountOrError.addressHex;
      const publicKey = nodeAccountOrError.publicKey.toString("hex");

      await PocketClientService.saveAccount(JSON.stringify(ppkData), passPhrase);

      const nodeBaseLink = `${window.location.origin}${_getDashboardPath(
        DASHBOARD_PATHS.nodeDetail
      )}`;
      const {success} = await NodeService.saveNodeAccount(nodeID, {address, publicKey}, nodeBaseLink);

      if (success) {
        const privateKey = await PocketClientService.exportPrivateKey(nodeAccountOrError, passPhrase);

        NodeService.removeNodeInfoFromCache();
        NodeService.saveNodeInfoInCache({
          passphrase: passPhrase,
          nodeID,
          address,
          privateKey,
        });
        this.setState({
          created: true,
          address,
          privateKey,
          ppkData
        });
      }
    } else {
      this.setState({error: {show: true, message: nodeAccountOrError.message}});
      scrollToId("alert");
    }
    this.setState({
      loading: false,
      redirectPath: _getDashboardPath(DASHBOARD_PATHS.nodeChainList),
    });
  }
}

export default NodePassphrase;
