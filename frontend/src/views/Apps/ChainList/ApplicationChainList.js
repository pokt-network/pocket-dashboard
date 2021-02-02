import React from "react";
import { Button, Col, FormControl, InputGroup, Row } from "react-bootstrap";
import { TABLE_COLUMNS } from "../../../_constants";
import PocketApplicationService from "../../../core/services/PocketApplicationService";
import PocketClientService from "../../../core/services/PocketClientService";
import { _getDashboardPath, DASHBOARD_PATHS } from "../../../_routes";
import Chains from "../../../core/components/Chains/Chains";
import Segment from "../../../core/components/Segment/Segment";
import AppTable from "../../../core/components/AppTable";
import AppAlert from "../../../core/components/AppAlert";
import { Configurations } from "../../../_configuration";

class ApplicationChainList extends Chains {
  constructor(props, context) {
    super(props, context);

    this.handleChains = this.handleChains.bind(this);
  }

  async handleChains() {
    const { chosenChains } = this.state;
    const chainsHashes = chosenChains.map((ch) => ch._id);

    PocketApplicationService.saveAppInfoInCache({ chains: chainsHashes });

    const {
      id,
      address,
      chains,
      passphrase,
    } = PocketApplicationService.getApplicationInfo();

    const unlockedAccount = await PocketClientService.getUnlockedAccount(
      address,
      passphrase
    );
    const clientAddressHex = unlockedAccount.addressHex;

    const url = _getDashboardPath(DASHBOARD_PATHS.appDetail);

    const detail = url.replace(":id", id);
    const applicationLink = `${window.location.origin}${detail}`;

    const stakeAmount = Configurations.pocket_network.free_tier.stake_amount.toString();

    const stakeInformation = {
      client_address: clientAddressHex,
      chains: chains,
      stake_amount: stakeAmount,
    };

    this.setState({ creatingFreeTier: true });

    const { success } = await PocketApplicationService.stakeFreeTierApplication(
      stakeInformation,
      applicationLink
    );

    // eslint-disable-next-line react/prop-types
    if (success) {
      this.props.history.push(
        _getDashboardPath(`${DASHBOARD_PATHS.appDetail.replace(":id", id)}`)
      );
    } else {
      // TODO: handle error on UI
    }
  }

  render() {
    const { filteredChains, chosenChains } = this.state;
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
        <AppAlert
          className="pb-3 pt-3 mb-4"
          title={<h4 className="ml-3">ATTENTION!</h4>}
        >
          <p>
            Please note that the total relays per day will be divided by the
            total of selected chains
          </p>
        </AppAlert>
        <Row>
          <Col className="page-title">
            <h1>Choose chains</h1>
            <p>
              Choose the blockchains you want to connect your app to. Remember
              you won&#39;t be able to change these chains unless you unstake
              then restake which will then be evenly divided across the selected
              number of networks.
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
                  onKeyPress={({ key }) => {
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
