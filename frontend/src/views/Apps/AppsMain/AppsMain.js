import React from "react";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "./AppsMain.scss";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InfoCards from "../../../core/components/InfoCards";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import {APPLICATIONS_LIMIT, BOND_STATUS_STR, STYLING, TABLE_COLUMNS,} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Loader from "../../../core/components/Loader";
import Main from "../../../core/components/Main/Main";
import {formatNetworkData, formatNumbers, getStakeStatus, mapStatusToField,} from "../../../_helpers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxOpen} from "@fortawesome/free-solid-svg-icons";
import Segment from "../../../core/components/Segment/Segment";
import overlayFactory from "react-bootstrap-table2-overlay";
import LoadingOverlay from "react-loading-overlay";
import InfiniteScroll from "react-infinite-scroller";
import ClipLoader from "react-spinners/ClipLoader";

class AppsMain extends Main {
  constructor(props, context) {
    super(props, context);

    this.handleAllItemsFilter = this.handleAllItemsFilter.bind(this);
    this.handleUserItemsFilter = this.handleUserItemsFilter.bind(this);
    this.loadMoreUserApps = this.loadMoreUserApps.bind(this);
    this.loadMoreRegisteredApps = this.loadMoreRegisteredApps.bind(this);

    this.state = {
      ...this.state,
      hasApps: false,
    };
  }

  componentDidMount() {
    const userEmail = UserService.getUserInfo().email;

    ApplicationService
      .getAllUserApplications(userEmail, APPLICATIONS_LIMIT)
      .then(userItems => {

        ApplicationService
          .getStakedApplicationSummary()
          .then(({totalApplications, averageRelays, averageStaked}) => {
            ApplicationService
              .getAllApplications(APPLICATIONS_LIMIT)
              .then(registeredItems => {
                this.setState({
                  userItems,
                  filteredItems: userItems,
                  total: totalApplications,
                  averageRelays,
                  averageStaked,
                  registeredItems,
                  loading: false,
                  hasApps: userItems.length > 0,
                });
              });
          });
      });

  }

  async handleAllItemsFilter(option) {
    this.setState({allItemsTableLoading: true});

    const registeredItems = await ApplicationService.getAllApplications(
      APPLICATIONS_LIMIT, 0, BOND_STATUS_STR[option]
    );

    this.setState({registeredItems, allItemsTableLoading: false});
  }

  async handleUserItemsFilter(option) {
    this.setState({userItemsTableLoading: true});

    const userEmail = UserService.getUserInfo().email;

    const userItems = await ApplicationService.getAllUserApplications(
      userEmail, APPLICATIONS_LIMIT, 0, BOND_STATUS_STR[option]
    );

    this.setState({
      userItems,
      filteredItems: userItems,
      userItemsTableLoading: false,
    });
  }

  async loadMoreUserApps(offset) {
    const {userItems} = this.state;
    const userEmail = UserService.getUserInfo().email;
    const newUserItems = await ApplicationService.getAllUserApplications(
      userEmail, APPLICATIONS_LIMIT, offset * APPLICATIONS_LIMIT + 1
    );

    const allUserItems = [...userItems, ...newUserItems];

    this.setState({
      hasMoreUserItems: newUserItems.length !== 0,
      userItems: allUserItems,
      filteredItems: userItems,
    });
  }

  async loadMoreRegisteredApps(offset) {
    const {registeredItems} = this.state;

    const newRegisteredItems = await ApplicationService
      .getAllApplications(APPLICATIONS_LIMIT, offset * APPLICATIONS_LIMIT + 1);

    const allRegisteredItems = [...registeredItems, ...newRegisteredItems];

    this.setState({
      hasMoreRegisteredItems: newRegisteredItems.length !== 0,
      registeredItems: allRegisteredItems,
    });
  }

  render() {
    const {
      filteredItems,
      total,
      averageStaked,
      averageRelays,
      registeredItems: allRegisteredItems,
      loading,
      allItemsTableLoading,
      userItemsTableLoading,
      hasApps,
      hasMoreUserItems,
      hasMoreRegisteredItems,
    } = this.state;

    const registeredItems = allRegisteredItems.map(mapStatusToField);

    const cards = [
      {title: formatNumbers(total), subtitle: "Total of Spps"},
      {
        title: formatNetworkData(averageStaked, false),
        subtitle: "Average Staked",
      },
      {
        title: formatNetworkData(averageRelays, false),
        subtitle: "Average Relays Per Application",
      },
    ];

    const loader = (
      <ClipLoader
        key={0}
        size={30}
        css={"display: block; margin: 0 auto;"}
        color={STYLING.lightGray}
        loading={true}
      />
    );

    if (loading) {
      return <Loader/>;
    }

    return (
      <div className="app-main">
        <Row>
          <Col sm="8" md="8" lg="8" className="page-title">
            <h1 className="ml-1">General Apps Information</h1>
          </Col>
          <Col sm="4" md="4" lg="4" className="d-flex justify-content-end cta-buttons">
            <Link to={_getDashboardPath(DASHBOARD_PATHS.createAppInfo)}>
              <Button className="ml-4 pl-4 pr-4 mr-3 create-app-button">
                <span>Create New App</span>
              </Button>
            </Link>
            <Link to={_getDashboardPath(DASHBOARD_PATHS.importApp)}>
              <Button variant="primary" size={"md"} className="pl-4 pr-4 import-app-button">
                <span>Import App</span>
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className="stats mb-4">
          <InfoCards cards={cards}/>
        </Row>
        <Row className="mb-4 app-tables">
          <Col sm="6" md="6" lg="6" className="my-apps-segment">
            <Segment label="My Apps">
              <Row className="search-panel">
                <Col>
                  <InputGroup className="search-input mb-3">
                    <FormControl
                      placeholder="Search an App"
                      name="searchQuery"
                      onChange={this.handleChange}
                      onKeyPress={({key}) => {
                        if (key === "Enter") {
                          this.handleSearch("pocketApplication.name");
                        }
                      }}
                    />
                    <InputGroup.Append>
                      <Button
                        type="submit"
                        onClick={this.handleChainSearch}
                        variant="outline-primary">
                        <img src="/assets/search.svg" alt="search-icon"/>
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Row>
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMoreUserApps}
                useWindow={false}
                hasMore={hasMoreUserItems}
                loader={loader}>
                <div className="main-list">
                  <LoadingOverlay active={userItemsTableLoading} spinner>
                    {hasApps ? (
                      filteredItems.map((app, idx) => {
                        const {name, icon} = app.pocketApplication;
                        const {stakedTokens, status} = app.networkData;
                        const {
                          address,
                        } = app.pocketApplication.publicPocketAccount;

                        return (
                          <Link
                            key={idx}
                            to={() => {
                              const url = _getDashboardPath(
                                DASHBOARD_PATHS.appDetail
                              );

                              return url.replace(":address", address);
                            }}
                          >
                            <PocketElementCard
                              title={name}
                              subtitle={`Staked POKT: ${formatNetworkData(stakedTokens)} POKT`}
                              status={getStakeStatus(status)}
                              iconURL={icon}
                            />
                          </Link>
                        );
                      })
                    ) : (
                      <div className="empty-overlay">
                        <FontAwesomeIcon
                          className="icon"
                          size="7x"
                          icon={faBoxOpen}
                        />
                        <p>
                          You have not created or <br/> imported any app yet!
                        </p>
                      </div>
                    )}
                  </LoadingOverlay>
                </div>
              </InfiniteScroll>
            </Segment>
          </Col>
          <Col sm="6" md="6" lg="6">
            <Segment label="REGISTERED APPS">
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMoreRegisteredApps}
                useWindow={false}
                hasMore={hasMoreRegisteredItems}
                loader={loader}
              >
                <BootstrapTable
                  classes="app-table"
                  keyField="pocketApplication.publicPocketAccount.address"
                  data={registeredItems}
                  columns={TABLE_COLUMNS.APPS}
                  bordered={false}
                  loading={allItemsTableLoading}
                  noDataIndication={"No apps found"}
                  overlay={overlayFactory({
                    spinner: true,
                    styles: {
                      overlay: (base) => ({
                        ...base,
                        background: "rgba(0, 0, 0, 0.2)",
                      }),
                    },
                  })}
                />
              </InfiniteScroll>
            </Segment>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AppsMain;
