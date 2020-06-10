import Passphrase from "../../../core/components/Passphrase/Passphrase";
import NodeService from "../../../core/services/PocketNodeService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {scrollToId} from "../../../_helpers";
import {
  DEFAULT_NETWORK_ERROR_MESSAGE,
  BACKEND_ERRORS,
} from "../../../_constants";

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
    const {success, data, name} = await NodeService.createNodeAccount(
      nodeId, passPhrase, nodeBaseLink
    );

    if (success) {
      const {privateNodeData, ppkData} = data;
      const {address, privateKey} = privateNodeData;

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
        ppkData,
      });
    } else {
      let error;

      if (name === BACKEND_ERRORS) {
        error = DEFAULT_NETWORK_ERROR_MESSAGE;
      } else {
        error = data.message;
      }

      this.setState({error: {show: true, message: error}});
      scrollToId("alert");
    }
    this.setState({
      loading: false,
      redirectPath: _getDashboardPath(DASHBOARD_PATHS.nodeChainList),
    });
  }
}

export default NodePassphrase;
