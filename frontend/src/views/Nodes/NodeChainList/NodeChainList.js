import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Button, Col, Row, FormControl, InputGroup} from "react-bootstrap";
import AppDropdown from "../../../core/components/AppDropdown/AppDropdown";
import {NETWORK_TABLE_COLUMNS} from "../../../constants";
import NetworkService from "../../../core/services/PocketNetworkService";
import Chains from "../../components/Chains/Chains";

class NodeChainList extends Chains {
  constructor(props, context) {
    super(props, context);

    this.handleChains = this.handleChains.bind(this);
  }

  handleChains() {
    // TODO: Handle chains on NODES
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
      <div id="choose-chains">
        <Row>
          <Col className="title">
            <div className="info">
              <h1>Choose chains</h1>
              <p>
                Pocket can support any blockchain infrastructure that has an
                HTTP endpoint. These are the <br /> blockchain networks the
                Pocket Core Protocol currently supports in Testnet phase one.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="7" md="7" lg="7">
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
          <Col sm="5" md="5" lg="5" className="order-by">
            <p style={{fontWeight: "bold", fontSize: "1.2em"}}>Order by:</p>
            {/* TODO: Implement sorting on chains */}
            <AppDropdown
              onSelect={(t) => console.log(t)}
              options={["All", "Newest", "Oldest"]}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <BootstrapTable
              classes="table app-table table-striped"
              keyField="hash"
              data={chains}
              columns={NETWORK_TABLE_COLUMNS}
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
