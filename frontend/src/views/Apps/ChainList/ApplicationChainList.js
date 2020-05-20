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
    const {filteredChains} = this.state;
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
              Choose the chains you want to connect your app or node to.
              Remember you won&#39;t be able to change these chains until your
              next stake which will be evenly divided on the selected number of
              chains.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <div className="mb-4 d-flex justify-content-between">
              <h2>Supported blockchains</h2>
              <Button
                onClick={this.handleChains}
                variant="primary"
                size={"md"}
                className="pl-4 pr-4"
              >
                <span>Continue</span>
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Segment scroll={false}>
              <Row className="search-panel">
                <Col>
                  <InputGroup className="search-input ml-5 mb-3">
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
                </Col>
              </Row>
              <AppTable
                scroll
                toggle={chains.length > 0}
                keyField="hash"
                data={chains}
                columns={TABLE_COLUMNS.NETWORK_CHAINS}
                selectRow={tableSelectOptions}
                bordered={false}
              />
            </Segment>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ApplicationChainList;
