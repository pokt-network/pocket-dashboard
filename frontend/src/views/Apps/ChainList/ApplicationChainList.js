import React from "react";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import {TABLE_COLUMNS} from "../../../_constants";
import PocketApplicationService from "../../../core/services/PocketApplicationService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Chains from "../../../core/components/Chains/Chains";
import Segment from "../../../core/components/Segment/Segment";
import AppTable from "../../../core/components/AppTable";

class ApplicationChainList extends Chains {
  constructor(props, context) {
    super(props, context);

    this.handleChains = this.handleChains.bind(this);
  }

  handleChains() {
    const {chosenChains} = this.state;
    const chainsHashes = chosenChains.map((ch) => ch.hash);

    PocketApplicationService.saveAppInfoInCache({chains: chainsHashes});

    // eslint-disable-next-line react/prop-types
    this.props.history.push(_getDashboardPath(DASHBOARD_PATHS.tierSelection));
  }

  render() {
    const {filteredChains, chosenChains} = this.state;
    const chains = filteredChains;

    // Bootstrap Table selectionParams
    const tableSelectOptions = {
      mode: "checkbox",
      clickToSelect: true,
      onSelect: this.onRowSelect,
      onSelectAll: this.onRowSelectAll,
    };

    return (
      <div className="choose-chains">
        <Row>
          <Col className="page-title">
            <h1>Choose chains</h1>
            <p>
              Choose the blockchains you want to connect your app to.
              Remember you won&#39;t be able to change these chains unless you 
              unstake then restake which will then be evenly divided across the 
              selected number of networks.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <div className="d-flex justify-content-between">
              <h2>Supported blockchains</h2>
              <Button
                disabled={chosenChains.length <= 0}
                onClick={this.handleChains}
                variant="primary"
                size={"md"}
              >
                <span>Continue</span>
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Segment bordered scroll={false} label="">
            <Row className="search-panel">
              <InputGroup className="search-input">
                <FormControl
                  placeholder="Search a chain"
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
                    variant="outline-primary"
                  >
                    <img src="/assets/search.svg" alt="search-icon" />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Row>
            <AppTable
              scroll
              toggle={chains.length > 0}
              keyField="_id"
              data={chains}
              height={454}
              columns={TABLE_COLUMNS.NETWORK_CHAINS}
              selectRow={tableSelectOptions}
              bordered={false}
            />
          </Segment>
        </Row>
      </div>
    );
  }
}

export default ApplicationChainList;
