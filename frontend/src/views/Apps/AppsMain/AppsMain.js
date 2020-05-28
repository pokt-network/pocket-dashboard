import React from "react";
import cls from "classnames";
import {Link} from "react-router-dom";
import AppTable from "../../../core/components/AppTable";
import "./AppsMain.scss";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InfoCards from "../../../core/components/InfoCards";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import {
  APPLICATIONS_LIMIT,
  BOND_STATUS_STR,
  STYLING,
  TABLE_COLUMNS,
} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Loader from "../../../core/components/Loader";
import Main from "../../../core/components/Main/Main";
import {
  formatNetworkData,
  formatNumbers,
  getStakeStatus,
  mapStatusToField,
} from "../../../_helpers";
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

    ApplicationService.getAllUserApplications(
      userEmail, APPLICATIONS_LIMIT
    ).then((userItems) => {
      ApplicationService.getStakedApplicationSummary().then(
        ({totalApplications, averageRelays, averageStaked}) => {
          ApplicationService.getAllApplications(APPLICATIONS_LIMIT).then(
            (registeredItems) => {
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
            }
          );
        }
      );
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

    const newRegisteredItems = await ApplicationService.getAllApplications(
      APPLICATIONS_LIMIT, offset * APPLICATIONS_LIMIT + 1
    );

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
      {title: formatNumbers(total), subtitle: "Total of Apps"},
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
      return <Loader />;
    }

    return (
      <div className="app-main">
        <Row>
          <Col sm="8" className="page-title">
            <h1>General Apps Information</h1>
          </Col>
          <Col
            sm="4"
            className="d-flex align-items-center justify-content-end cta-buttons"
          >
            <Link to={_getDashboardPath(DASHBOARD_PATHS.createAppInfo)}>
              <Button className="ml-4 mr-3 create-app-button">
                <span>Create New App</span>
              </Button>
            </Link>
            <Link to={_getDashboardPath(DASHBOARD_PATHS.importApp)}>
              <Button
                variant="primary"
                size={"md"}
                className="import-app-button"
              >
                <span>Import App</span>
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className="stats">
          <InfoCards cards={cards} />
        </Row>
        <Row className="mb-4 app-tables">
          <Col sm="6" className="my-apps-segment">
            <Segment bordered scroll={false} label="My Apps">
              <Row
                className={cls("search-panel", {
                  "search-panel-without-apps": !hasApps,
                })}
              >
                <InputGroup className="search-input">
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
                      variant="outline-primary"
                    >
                      <img src={"/assets/search.svg"} alt="search-icon" />
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Row>
              <div className="scrollable main-list">
                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadMoreUserApps}
                  useWindow={false}
                  hasMore={hasMoreUserItems}
                  loader={loader}
                >
                  <LoadingOverlay active={userItemsTableLoading} spinner>
                    {hasApps ? (
                      filteredItems.map((app, idx) => {
                        const {name, icon} = app.pocketApplication;
                        const {stakedTokens, status} = app.networkData;

                        return (
                          <Link
                            key={idx}
                            to={() => {
                              const address = app.networkData.address;
                              const applicationID = app.pocketApplication.id;

                              if (!address) {
                                ApplicationService.saveAppInfoInCache({
                                  applicationID,
                                });
                                return _getDashboardPath(
                                  DASHBOARD_PATHS.appPassphrase
                                );
                              }
                              const url = _getDashboardPath(
                                DASHBOARD_PATHS.appDetail
                              );

                              return url.replace(":address", address);
                            }}
                          >
                            <PocketElementCard
                              title={name}
                              subtitle={`Staked POKT: ${formatNetworkData(
                                stakedTokens
                              )} POKT`}
                              status={getStakeStatus(status)}
                              iconURL={icon}
                            />
                          </Link>
                        );
                      })
                    ) : (
                      <div className="empty-overlay">
                        <img
                          src={"/assets/empty-box.svg"}
                          alt="apps-empty-box"
                        />
                        <p>
                          You have not created <br /> or imported any app yet
                        </p>
                      </div>
                    )}
                  </LoadingOverlay>
                </InfiniteScroll>
              </div>
            </Segment>
          </Col>
          <Col
            sm="6"
            className={`${
              registeredItems.length === 0 ? "segment-table-empty" : ""
            }`}
          >
            <Segment scroll={false} label="REGISTERED APPS">
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMoreRegisteredApps}
                useWindow={false}
                hasMore={hasMoreRegisteredItems}
                loader={loader}
              >
                <AppTable
                  scroll
                  classes={`flex-body ${
                    hasMoreRegisteredItems ? "loading" : ""
                  } `}
                  headerClasses="d-flex"
                  toggle={registeredItems.length > 0}
                  keyField="pocketApplication.id"
                  data={registeredItems}
                  columns={TABLE_COLUMNS.APPS}
                  bordered={false}
                  loading={allItemsTableLoading}
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
