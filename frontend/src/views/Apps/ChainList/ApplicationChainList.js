import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import {TABLE_COLUMNS} from "../../../_constants";
import PocketApplicationService from "../../../core/services/PocketApplicationService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Chains from "../../../core/components/Chains/Chains";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

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
      <div id="choose-chains">
        <Row>
          <Col className="title">
            <div className="info">
              <h1>Choose chains</h1>
              <p>
                Choose the chains you want to connect your app or node to.
                Remember you won&#39;t be able to change these chains until your
                next stake which will be evenly divided on the selected number
                of chains.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="mb-4 d-flex justify-content-between">
              <h2>Supported blockchains</h2>
              <Button
                onClick={this.handleChains}
                variant="primary"
                size={"md"}
                className="pl-4 pr-4"
              >
                Continue
              </Button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg="5" md="5" sm="5">
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
                  <FontAwesomeIcon icon={faSearch}/>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <BootstrapTable
              classes="table app-table"
              keyField="hash"
              data={chains}
              columns={TABLE_COLUMNS.NETWORK_CHAINS}
              selectRow={tableSelectOptions}
              bordered={false}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ApplicationChainList;
