import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import {NETWORK_TABLE_COLUMNS} from "../../../_constants";
import ApplicationService from "../../../core/services/PocketApplicationService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Chains from "../../../core/components/Chains/Chains";

class ChooseChain extends Chains {
  constructor(props, context) {
    super(props, context);

    this.handleChains = this.handleChains.bind(this);
  }

  handleChains() {
    const {chosenChains} = this.state;
    const chainsHashes = chosenChains.map((ch) => ch.hash);

    ApplicationService.saveAppInfoInCache({chains: chainsHashes});

    // eslint-disable-next-line react/prop-types
    this.props.history.push(_getDashboardPath(DASHBOARD_PATHS.tierSelection));
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
              columns={NETWORK_TABLE_COLUMNS}
              selectRow={tableSelectOptions}
              bordered={false}
            />
            <Button
              onClick={this.handleChains}
              variant="dark"
              size={"lg"}
              className="float-right mt-4 pl-5 pr-5"
            >
              Continue
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ChooseChain;
