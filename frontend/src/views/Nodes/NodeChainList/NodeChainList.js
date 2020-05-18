import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import {TABLE_COLUMNS} from "../../../_constants";
import NetworkService from "../../../core/services/PocketNetworkService";
import Chains from "../../../core/components/Chains/Chains";
import NodeService from "../../../core/services/PocketNodeService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";

class NodeChainList extends Chains {
  constructor(props, context) {
    super(props, context);

    this.handleChains = this.handleChains.bind(this);
  }

  handleChains() {
    const {chosenChains} = this.state;
    const chainsHashes = chosenChains.map((ch) => ch.hash);

    NodeService.saveNodeInfoInCache({chains: chainsHashes});

    // TODO: Redirect to tier selection when available
    const {address} = NodeService.getNodeInfo();
    const url = _getDashboardPath(DASHBOARD_PATHS.nodeDetail).replace(
      ":address", address );

    // eslint-disable-next-line react/prop-types
    this.props.history.push(url);
  }

  async componentDidMount() {
    const chains = await NetworkService.getAvailableNetworkChains();

    this.setState({chains});
  }

  render() {
    const {chains: allChains, filteredChains} = this.state;
    const chains = filteredChains.length === 0 ? allChains : filteredChains;

    // BoostrapTable selectionParams
    const tableSelectOptions = {
      mode: "checkbox",
      clickToSelect: true,
      onSelect: this.onRowSelect,
      onSelectAll: this.onRowSelectAll,
    };

    return (
      <div className="choose-chains">
        <Row>
          <Col className="title">
            <div className="info">
              <h1>Choose chains</h1>
              <p>
                Pocket can support any blockchain infrastructure that has an
                HTTP endpoint. These are the <br/> blockchain networks the
                Pocket Core Protocol currently supports in Testnet phase one.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search chain"
                name="searchChainQuery"
                onChange={this.handleChange}
                onKeyPress={({key}) => {
                  if (key === "Enter") {
                    this.handleChainSearch();
                  }
                }}
              />
              <InputGroup.Append>
                <Button
                  type="submit"
                  onClick={this.handleChainSearch}
                  variant="dark"
                >
                  Search
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <BootstrapTable
              classes="table app-table table-striped"
              keyField="hash"
              data={chains}
              columns={TABLE_COLUMNS.NETWORK_CHAINS}
              selectRow={tableSelectOptions}
              bordered={false}
            />
            <InputGroup className="mt-5">
              <FormControl
                placeholder="Search service URL"
                name="searchQuery"
                onChange={this.handleChange}
                onKeyPress={({key}) => {
                  if (key === "Enter") {
                    this.handleServiceNodeSearch();
                  }
                }}
              />
              <InputGroup.Append>
                <Button
                  type="submit"
                  onClick={this.handleServiceNodeSearch}
                  variant="dark"
                >
                  Search
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <Button
              onClick={this.handleChains}
              variant="dark"
              size={"lg"}
              className="float-right mb-5 mt-4 pl-5 pr-5"
            >
              Continue
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NodeChainList;
