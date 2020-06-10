import React from "react";
import {Link} from "react-router-dom";
import cls from "classnames";
import AppTable from "../../../core/components/AppTable";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InfoCards from "../../../core/components/InfoCards";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import UserService from "../../../core/services/PocketUserService";
import {NODES_LIMIT, TABLE_COLUMNS, STYLING} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Loader from "../../../core/components/Loader";
import Main from "../../../core/components/Main/Main";
import {formatNetworkData, formatNumbers, getStakeStatus, mapStatusToField} from "../../../_helpers";
import Segment from "../../../core/components/Segment/Segment";
import overlayFactory from "react-bootstrap-table2-overlay";
import LoadingOverlay from "react-loading-overlay";
import NodeService from "../../../core/services/PocketNodeService";
import _ from "lodash";
import InfiniteScroll from "react-infinite-scroller";
import ClipLoader from "react-spinners/ClipLoader";

const MY_NODES_HEIGHT = 358;

class NodesMain extends Main {
  constructor(props, context) {
    super(props, context);

    this.loadMoreUserNodes = this.loadMoreUserNodes.bind(this);
    this.loadMoreRegisteredNodes = this.loadMoreRegisteredNodes.bind(this);

    this.state = {
      ...this.state,
      hasNodes: false,
    };
  }

  async componentDidMount() {
    const userEmail = UserService.getUserInfo().email;

    NodeService.getAllUserNodes(userEmail, NODES_LIMIT).then((userItems) => {
      // TODO: Get node summary data
      NodeService.getStakedNodeSummary().then(
        ({totalNodes, averageValidatorPower: averageRelays, averageStaked}) => {
          NodeService.getAllNodes(NODES_LIMIT).then((registeredItems) => {
            this.setState({
              userItems,
              filteredItems: userItems,
              total: totalNodes,
              averageRelays,
              averageStaked,
              registeredItems,
              loading: false,
              hasNodes: userItems.length > 0,
            });
          });
        }
      );
    });
  }

  async loadMoreUserNodes(offset) {
    const {userItems} = this.state;
    const userEmail = UserService.getUserInfo().email;
    const newUserItems = await NodeService.getAllUserNodes(
      userEmail, NODES_LIMIT, offset * NODES_LIMIT + 1
    );

    const allUserItems = [...userItems, ...newUserItems];

    this.setState({
      hasMoreUserItems: newUserItems.length !== 0,
      userItems: allUserItems,
      filteredItems: userItems,
    });
  }

  async loadMoreRegisteredNodes(offset) {
    const {registeredItems} = this.state;

    const newRegisteredItems = await NodeService.getAllNodes(
      NODES_LIMIT, offset * NODES_LIMIT + 1
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
      hasNodes,
      hasMoreUserItems,
      hasMoreRegisteredItems,
    } = this.state;

    const registeredItems = allRegisteredItems.map(mapStatusToField);
    const myNodessHasScroll =
    hasNodes && filteredItems.length * 105 > MY_NODES_HEIGHT;

    const cards = [
      {title: formatNumbers(total), subtitle: "Total of Nodes"},
      {
        title: formatNetworkData(averageStaked, false),
        subtitle: "Avr Staked Token Per Node",
      },
      {
        title: formatNetworkData(averageRelays, false),
        subtitle: "Avr Validator Power Per Node",
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
          <Col sm="8" md="8" lg="8" className="page-title">
            <h1 className="ml-1">General Nodes Information</h1>
          </Col>
          <Col
            sm="4"
            md="4"
            lg="4"
            className="d-flex justify-content-end cta-buttons"
          >
            <Link to={_getDashboardPath(DASHBOARD_PATHS.createNodeForm)}>
              <Button
                variant="dark"
                className="ml-4 pl-4 pr-4 mr-3 create-node-button"
              >
                <span>Create New Node</span>
              </Button>
            </Link>
            <Link to={_getDashboardPath(DASHBOARD_PATHS.importNode)}>
              <Button
                variant="primary"
                size={"md"}
                className="pl-4 pr-4 import-node-button"
              >
                <span>Import Node</span>
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className="stats mb-4">
          <InfoCards cards={cards} />
        </Row>
        <Row className="mb-4 app-tables">
          <Col sm="6" md="6" lg="6" className="my-items-segment">
            <Segment bordered empty={!hasNodes} scroll={false} label="My Nodes">
              {hasNodes && (
                <Row className="search-panel">
                  <Col>
                    <InputGroup className="search-input mb-3">
                      <FormControl
                        placeholder="Search a Node"
                        name="searchQuery"
                        onChange={this.handleChange}
                        onKeyPress={({key}) => {
                          if (key === "Enter") {
                            this.handleSearch("pocketNode.name");
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
                  </Col>
                </Row>
              )}
              <div 
                className={cls("scrollable main-list", {
                  "has-scroll": myNodessHasScroll,
                })}
                style={{height: `${MY_NODES_HEIGHT}px`}}
              >
                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadMoreUserNodes}
                  useWindow={false}
                  hasMore={hasMoreUserItems}
                  loader={loader}
                >
                <LoadingOverlay active={userItemsTableLoading} spinner>
                  {hasNodes ? (
                    filteredItems.map((node, idx) => {
                      const {id: nodeID, name, address, stakedPOKT, status, icon} = node;

                      return (
                        <Link
                          key={idx}
                          to={() => {

                              if (!address) {
                                NodeService.saveNodeInfoInCache({
                                  nodeID,
                                });
                                return _getDashboardPath(
                                  DASHBOARD_PATHS.nodePassphrase
                                );
                              }
                              const url = _getDashboardPath(
                                DASHBOARD_PATHS.nodeDetail
                              );

                              return url.replace(":address", address);
                            }}
                          >
                            <PocketElementCard
                              title={name}
                              subtitle={`Staked POKT: ${formatNetworkData(
                                stakedPOKT
                              )} POKT`}
                              status={getStakeStatus(
                                _.isNumber(status) ? status : parseInt(status)
                              )}
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
                          You have not created <br /> or imported any node yet
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
            md="6"
            lg="6"
            className={`${
              registeredItems.length === 0 ? "segment-table-empty" : ""
            }`}
          >
            <Segment scroll={false} label="REGISTERED NODES">
              {/* FIXME: Always perform a search */}
              {/*<InfiniteScroll*/}
              {/*  pageStart={0}*/}
              {/*  loadMore={this.loadMoreRegisteredNodes}*/}
              {/*  useWindow={false}*/}
              {/*  hasMore={hasMoreRegisteredItems}*/}
              {/*  loader={loader}*/}
              {/*>*/}
              <AppTable
                scroll
                classes={`flex-body ${
                  hasMoreRegisteredItems ? "loading" : ""
                } `}
                headerClasses="d-flex"
                toggle={registeredItems.length > 0}
                keyField="address"
                data={registeredItems}
                columns={TABLE_COLUMNS.NODES}
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
              {/*</InfiniteScroll>*/}
            </Segment>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NodesMain;
