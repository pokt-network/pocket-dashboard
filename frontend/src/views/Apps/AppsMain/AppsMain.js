import React from "react";
import cls from "classnames";
import { Link } from "react-router-dom";
import AppTable from "../../../core/components/AppTable";
import { Button, Col, FormControl, InputGroup, Row } from "react-bootstrap";
import InfoCards from "../../../core/components/InfoCards";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import {
  APPLICATIONS_LIMIT,
  TABLE_COLUMNS,
  STYLING,
  BACKEND_ERRORS,
  DEFAULT_NETWORK_ERROR_MESSAGE } from "../../../_constants";
import { _getDashboardPath, DASHBOARD_PATHS } from "../../../_routes";
import Loader from "../../../core/components/Loader";
import Main from "../../../core/components/Main/Main";
import { formatNetworkData, formatNumbers, getStakeStatus, mapStatusToField } from "../../../_helpers";
import Segment from "../../../core/components/Segment/Segment";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import AppAlert from "../../../core/components/AppAlert";
import InfiniteScroll from "react-infinite-scroller";
import ClipLoader from "react-spinners/ClipLoader";

const MY_APPS_HEIGHT = 358;

class AppsMain extends Main {
  constructor(props, context) {
    super(props, context);

    this.loadMoreUserApps = this.loadMoreUserApps.bind(this);
    this.loadMoreRegisteredApps = this.loadMoreRegisteredApps.bind(this);

    this.state = {
      ...this.state,
      hasApps: false,
    };
  }

  componentDidMount() {
    const userEmail = UserService.getUserInfo().email;
    let hasError = false;
    let errorMessage = "";
    let errorType = "";

    ApplicationService.getAllUserApplications(userEmail, APPLICATIONS_LIMIT)
      .then(userItems => {
        hasError = userItems.error ? userItems.error : hasError;
        errorMessage = userItems.error ? userItems.message : errorMessage;
        errorType = userItems.error ? userItems.name : errorType;

        if (!userItems.error) {
          this.setState({
            userItems,
            filteredItems: userItems,
            hasApps: userItems.length > 0,
          });
        }
      });

    ApplicationService.getStakedApplicationSummary()
      .then(
        ({ totalApplications,
          totalStaked,
          averageStaked,
          error,
          name,
          message }) => {

          hasError = error ? error : hasError;
          errorMessage = error ? message : errorMessage;
          errorType = error ? name : errorType;

          if (!error) {
            this.setState({
              total: totalApplications,
              totalStaked,
              averageStaked,
              loading: false,
            });
          }
        }
      );

    ApplicationService.getAllApplications(APPLICATIONS_LIMIT)
      .then(registeredItems => {
        hasError = registeredItems.error ? registeredItems.error : hasError;
        errorMessage = registeredItems.error
          ? registeredItems.message
          : errorMessage;
        errorType = registeredItems.error ? registeredItems.name : errorType;

        if (!registeredItems.error) {
            this.setState({
              registeredItems,
              loading: false,
            });
          }
        }
      );

      if (errorType === BACKEND_ERRORS.NETWORK) {
        errorMessage = DEFAULT_NETWORK_ERROR_MESSAGE;
      }

      if (hasError) {
        this.setState({
          loading: false,
          error: { show: true, message: errorMessage },
        });
      }
  }

  async loadMoreUserApps(offset) {
    const { userItems } = this.state;
    const userEmail = UserService.getUserInfo().email;
    const newUserItems = await ApplicationService.getAllUserApplications(
      userEmail, APPLICATIONS_LIMIT, (offset) * APPLICATIONS_LIMIT + 1
    );

    const allUserItems = [...userItems, ...newUserItems];

    this.setState({
      hasMoreUserItems: newUserItems.length === APPLICATIONS_LIMIT,
      userItems: allUserItems,
      filteredItems: allUserItems,
    });
  }

  async loadMoreRegisteredApps(offset) {
    const { registeredItems } = this.state;

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
      totalStaked,
      registeredItems: allRegisteredItems,
      loading,
      allItemsTableLoading,
      userItemsTableLoading,
      hasApps,
      hasMoreUserItems,
      hasMoreRegisteredItems,
      error
    } = this.state;

    const registeredItems = allRegisteredItems.map(mapStatusToField);
    const myAppsHasScroll =
      hasApps && filteredItems.length * 105 > MY_APPS_HEIGHT;

    const cards = [
      { title: formatNumbers(total), subtitle: "Total of Apps" },
      {
        title: formatNetworkData(averageStaked, false),
        subtitle: "Average POKT Staked",
      },
      {
        title: formatNetworkData(totalStaked, false),
        subtitle: "Apps Total POKT Staked",
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
      <div className="main">
        <Row>
          {error.show && (
            <AppAlert
              variant="danger"
              title={error.message}
              dismissible
              onClose={() => this.setState({ error: { show: false } })}
            />
          )}
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
          <InfoCards cards={cards}/>
        </Row>
        <Row className="mb-4 app-tables">
          <Col sm="6" className="my-items-segment">
            <Segment bordered empty={!hasApps} scroll={false} label="My Apps">
              {hasApps && (
                <Row className="search-panel">
                  <InputGroup className="search-input">
                    <FormControl
                      placeholder="Search an App"
                      name="searchQuery"
                      onChange={this.handleChange}
                      onKeyPress={({ key }) => {
                        if (key === "Enter") {
                          this.handleSearch("name");
                        }
                      }}
                    />
                    <InputGroup.Append>
                      <Button
                        type="submit"
                        onClick={this.handleChainSearch}
                        variant="outline-primary"
                      >
                        <img src={"/assets/search.svg"} alt="search-icon"/>
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Row>
              )}
              <div
                className={cls("scrollable main-list", {
                  "has-scroll": myAppsHasScroll,
                })}
                style={{ height: `${MY_APPS_HEIGHT}px` }}
              >
                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadMoreUserApps}
                  useWindow={false}
                  hasMore={hasApps && hasMoreUserItems}
                  loader={loader}
                >
                <LoadingOverlay active={userItemsTableLoading} spinner>
                  {hasApps ? (
                    filteredItems.map((app, idx) => {
                      const { id: applicationID, name, stakedPOKT, status, icon } = app;

                      return (
                        <Link
                          key={idx}
                          to={() => {
                            if (!applicationID) {
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

                              return url.replace(":id", applicationID);
                            }}
                          >
                            <PocketElementCard
                              title={name}
                              subtitle={`Staked POKT: ${formatNetworkData(
                                stakedPOKT, false)} POKT`}
                              status={getStakeStatus(
                                _.isNumber(status) ? status : parseInt(status)
                              )}
                              iconURL={icon}
                            />
                          </Link>
                        );
                      })
                    ) : (
                      <div className="app-empty-overlay">
                        <img
                          src={"/assets/triangle-gray.svg"}
                          alt="apps-empty-box"
                        />
                        <p>
                          You don&apos;t have any apps yet.
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
            <Segment bordered scroll={false} label="REGISTERED APPS">
              <div className="scroll-table">
                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadMoreRegisteredApps}
                  useWindow={false}
                  hasMore={hasMoreRegisteredItems}
                  loader={loader}
                >
                  <AppTable
                    classes={`flex-body ${
                      hasMoreRegisteredItems ? "loading" : ""
                    } `}
                    headerClasses="d-flex"
                    toggle={registeredItems.length > 0}
                    keyField="address"
                    data={registeredItems}
                    columns={TABLE_COLUMNS.APPS}
                    bordered={false}
                    loading={allItemsTableLoading}
                    />
                </InfiniteScroll>
              </div>
            </Segment>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AppsMain;
