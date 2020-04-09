import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "./ChainList.scss";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import AppDropdown from "../../../core/components/AppDropdown/AppDropdown";
import NetworkService from "../../../core/services/PocketNetworkService";
import ApplicationService from "../../../core/services/PocketApplicationService";
import {DASHBOARD_PATHS, _getDashboardPath} from "../../../_routes";

class ChooseChain extends Component {
  constructor(props, context) {
    super(props, context);

    this.onRowSelect = this.onRowSelect.bind(this);
    this.onRowSelectAll = this.onRowSelectAll.bind(this);
    this.handleChains = this.handleChains.bind(this);

    this.state = {
      chains: [],
      chosenChains: [],
    };
  }

  handleChains() {
    const {chosenChains} = this.state;
    const chainsHashes = chosenChains.map((ch) => ch.hash);

    ApplicationService.saveAppInfoInCache({chains: chainsHashes});

    // eslint-disable-next-line react/prop-types
    this.props.history.push(_getDashboardPath(DASHBOARD_PATHS.tierSelection));
  }

  async componentDidMount() {
    const chains = await NetworkService.getAvailableNetworkChains();

    this.setState({chains});
  }

  onRowSelect(row, isSelect, rowIndex, e) {
    let {chosenChains} = this.state;

    if (isSelect) {
      chosenChains = [...chosenChains, row];
    } else {
      chosenChains = chosenChains.filter((chain) => chain.hash !== row.hash);
    }

    this.setState({chosenChains});
  }

  onRowSelectAll(isSelect, rows, e) {
    let {chosenChains} = this.state;

    if (isSelect) {
      chosenChains = rows;
    } else {
      chosenChains = [];
    }

    this.setState({chosenChains});
  }

  render() {
    const {chains} = this.state;

    const columns = [
      {
        dataField: "name",
        text: "Network",
      },
      {
        dataField: "netID",
        text: "Network Identifier (NetID)",
      },
      {
        dataField: "hash",
        text: "Hash",
      },
    ];

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
            <Button variant="dark" size={"lg"} className="pl-5 pr-5">
              Continue
            </Button>
          </Col>
        </Row>
        <Row>
          <Col sm="7" md="7" lg="7">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Search app"
                name="searchQuery"
                onChange={this.handleChange}
                onKeyPress={({key}) => {
                  if (key === "Enter") {
                    this.handleAppSearch();
                  }
                }}
              />
              <InputGroup.Append>
                <Button
                  type="submit"
                  onClick={this.handleAppSearch}
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
              columns={columns}
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
