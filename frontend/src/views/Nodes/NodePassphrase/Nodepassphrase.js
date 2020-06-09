import Passphrase from "../../../core/components/Passphrase/Passphrase";
import NodeService from "../../../core/services/PocketNodeService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {scrollToId} from "../../../_helpers";
import PocketClientService from "../../../core/services/PocketClientService";

class NodePassphrase extends Passphrase {
  componentDidMount() {
    this.setState({type: "node", fileName: "MyPocketNode"});
  }

  async createAccount() {
    this.setState({loading: true});
    const {id: nodeId} = NodeService.getNodeInfo();
    const {passPhrase} = this.state;
    const nodeBaseLink = `${window.location.origin}${_getDashboardPath(
      DASHBOARD_PATHS.nodeDetail
    )}`;
    const {success, data} = await NodeService.createNodeAccount(
      nodeId, passPhrase, nodeBaseLink
    );

    if (success) {
      const {privateNodeData, ppkData} = data;
      const {address, privateKey} = privateNodeData;

      await PocketClientService.saveAccount(
        JSON.stringify(ppkData), passPhrase);

      NodeService.removeNodeInfoFromCache();
      NodeService.saveNodeInfoInCache({
        applicationID: nodeId,
        passphrase: passPhrase,
        address,
        privateKey,
      });
      this.setState({
        created: true,
        address,
        privateKey,
        ppkData
      });
    } else {
      this.setState({error: {show: true, message: data.message}});
      scrollToId("alert");
    }
    this.setState({
      loading: false,
      redirectPath: _getDashboardPath(DASHBOARD_PATHS.nodeChainList),
    });
  }
}

export default NodePassphrase;
