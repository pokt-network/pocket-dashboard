import React, { Component } from "react";
import { Alert, Button, Col, Modal, Row } from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {
  BACKEND_ERRORS,
  DEFAULT_NETWORK_ERROR_MESSAGE,
  STAKE_STATUS,
  TABLE_COLUMNS,
} from "../../../_constants";
import NetworkService from "../../../core/services/PocketNetworkService";
import Loader from "../../../core/components/Loader";
import { _getDashboardPath, DASHBOARD_PATHS } from "../../../_routes";
import DeletedOverlay from "../../../core/components/DeletedOverlay/DeletedOverlay";
import {
  formatDaysCountdown,
  formatNetworkData,
  formatNumbers,
  getStakeStatus,
} from "../../../_helpers";
import { Link } from "react-router-dom";
import PocketUserService from "../../../core/services/PocketUserService";
import AppTable from "../../../core/components/AppTable";
import AppAlert from "../../../core/components/AppAlert";
import ValidateKeys from "../../../core/components/ValidateKeys/ValidateKeys";
import Segment from "../../../core/components/Segment/Segment";
import NodeService from "../../../core/services/PocketNodeService";
import "../../../scss/Views/Detail.scss";
import PocketAccountService from "../../../core/services/PocketAccountService";
import PocketClientService from "../../../core/services/PocketClientService";

class NodeDetail extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pocketNode: {},
      networkData: {},
      chains: [],
      aat: {},
      accountBalance: 0,
      loading: true,
      deleteModal: false,
      deleted: false,
      message: "",
      purchase: true,
      hideTable: false,
      unjailAlert: false,
      exists: true,
      unstake: false,
      unjail: false,
      stake: false,
      ctaButtonPressed: false,
      serviceUrl: "",
      updatingAlert: false,
      error: { show: false, message: "" },
    };

    this.deleteNode = this.deleteNode.bind(this);
    this.unstakeNode = this.unstakeNode.bind(this);
    this.stakeNode = this.stakeNode.bind(this);
    this.unjailNode = this.unjailNode.bind(this);
  }

  async componentDidMount() {
    let hasError = false;
    let errorType = "";

    // eslint-disable-next-line react/prop-types
    const { address } = this.props.match.params;

    const { pocketNode, networkData, error, name } =
      (await NodeService.getNode(address)) || {};

    hasError = error ? error : hasError;
    errorType = error ? name : errorType;

    if (hasError || pocketNode === undefined) {
      if (errorType === BACKEND_ERRORS.NETWORK) {
        this.setState({
          loading: false,
          error: {
            show: true,
            message: DEFAULT_NETWORK_ERROR_MESSAGE,
          },
        });
      } else {
        this.setState({ loading: false, exists: false });
      }
      return;
    }

    let chains = await NetworkService.getNetworkChains(networkData.chains);

    const {
      balance: accountBalance,
    } = await PocketAccountService.getPoktBalance(address);

    const nodeFromCache = NodeService.getNodeInfo();

    if (nodeFromCache.chainsObject !== undefined) {
      chains = nodeFromCache.chainsObject;
    }

    const status = getStakeStatus(parseInt(networkData.status));
    const updatingAlert =
      pocketNode.updatingStatus && status === STAKE_STATUS.Unstaked;

    this.setState({
      pocketNode,
      networkData,
      chains,
      accountBalance,
      serviceUrl: nodeFromCache.serviceURL,
      loading: false,
      updatingAlert,
      unjailAlert: networkData.jailed,
    });

    // eslint-disable-next-line react/prop-types
    this.props.onBreadCrumbChange(["Nodes", "Node Detail"]);
  }

  async deleteNode() {
    const { address } = this.state.pocketNode.publicPocketAccount;

    const nodesLink = `${window.location.origin}${_getDashboardPath(
      DASHBOARD_PATHS.nodes
    )}`;
    const userEmail = PocketUserService.getUserInfo().email;

    const success = await NodeService.deleteNodeFromDashboard(
      address,
      userEmail,
      nodesLink
    );

    NodeService.removeNodeInfoFromCache();

    if (success) {
      this.setState({ deleted: true });
      // eslint-disable-next-line react/prop-types
      this.props.onBreadCrumbChange(["Nodes", "Node Detail", "Node Removed"]);
    }
  }

  async unstakeNode({ ppk, passphrase, address }) {
    const url = _getDashboardPath(DASHBOARD_PATHS.nodeDetail);
    const detail = url.replace(":address", address);
    const nodeLink = `${window.location.origin}${detail}`;

    const account = await PocketClientService.saveAccount(
      JSON.stringify(ppk),
      passphrase
    );

    const nodeUnstakeTransaction = await PocketClientService.nodeUnstakeRequest(
      account.addressHex,
      passphrase
    );

    const { success, data } = await NodeService.unstakeNode(
      nodeUnstakeTransaction,
      nodeLink
    );

    if (success) {
      window.location.reload(false);
    } else {
      this.setState({ unstaking: false, message: data });
    }
  }

  async unjailNode({ ppk, passphrase, address }) {
    const url = _getDashboardPath(DASHBOARD_PATHS.nodeDetail);
    const detail = url.replace(":address", address);
    const nodeLink = `${window.location.origin}${detail}`;

    await PocketClientService.saveAccount(JSON.stringify(ppk), passphrase);

    const nodeUnjailTransaction = await PocketClientService.nodeUnjailRequest(
      address,
      passphrase
    );

    const { success, data } = await NodeService.unjailNode(
      nodeUnjailTransaction,
      nodeLink
    );

    if (success) {
      window.location.reload(false);
    } else {
      this.setState({ unjail: false, error: { show: true, message: data } });
    }
  }

  async stakeNode({ ppk, passphrase, address }) {
    NodeService.removeNodeInfoFromCache();
    NodeService.saveNodeInfoInCache({ address, passphrase, ppk });

    await PocketClientService.saveAccount(JSON.stringify(ppk), passphrase);
    PocketUserService.saveUserAction("Stake Node");

    // eslint-disable-next-line react/prop-types
    this.props.history.push(_getDashboardPath(DASHBOARD_PATHS.nodeChainList));
  }

  render() {
    const {
      name,
      contactEmail,
      operator,
      description,
      icon,
      publicPocketAccount,
    } = this.state.pocketNode;

    const {
      jailed,
      tokens: stakedTokens,
      status: stakeStatus,
      unstaking_time: unstakingCompletionTime,
    } = this.state.networkData;

    const serviceURL = this.state.serviceUrl;

    const copyStakeStatus = stakeStatus;

    const status = getStakeStatus(parseInt(copyStakeStatus));
    // const isStaked =
    // status !== STAKE_STATUS.Unstaked && status !== STAKE_STATUS.Unstaking;

    let address;
    let publicKey;

    if (publicPocketAccount) {
      address = publicPocketAccount.address;
      publicKey = publicPocketAccount.publicKey;
    }

    const {
      chains,
      loading,
      deleteModal,
      deleted,
      error,
      exists,
      unstake,
      unjail,
      stake,
      unjailAlert,
      ctaButtonPressed,
      accountBalance,
      updatingAlert,
    } = this.state;

    const unstakingTime =
      status === STAKE_STATUS.Unstaking
        ? formatDaysCountdown(unstakingCompletionTime)
        : undefined;

    let jailStatus;
    let jailActionItem;

    const JAIL_STATUS_STR = {
      JAILED: "YES",
      UNJAILED: "NO",
      UNJAILING: "Processing",
    };

    if (jailed) {
      jailStatus = JAIL_STATUS_STR.JAILED;
      jailActionItem = (
        <p
          onClick={() =>
            this.setState({ ctaButtonPressed: true, unjail: true })
          }
          className="unjail"
        >
          Unjail this node
        </p>
      );
    } else if (!jailed) {
      jailStatus = JAIL_STATUS_STR.UNJAILED;
    } else {
      jailStatus = JAIL_STATUS_STR.UNJAILING;
      // TODO: Set unjailing time format
      jailActionItem = <p className="unjailing">Remaining: {"5:00"} ming</p>;
    }

    const generalInfo = [
      {
        title: `${formatNetworkData(stakedTokens)} POKT`,
        titleAttrs: {
          title: stakedTokens ? formatNumbers(stakedTokens) : undefined,
        },
        subtitle: "Staked tokens",
      },
      {
        title: `${formatNetworkData(accountBalance)} POKT`,
        titleAttrs: {
          title: accountBalance ? formatNumbers(accountBalance) : undefined,
        },
        subtitle: "Balance",
      },
      {
        title: status,
        subtitle: "Stake Status",
        children:
          status === STAKE_STATUS.Unstaking ? (
            <p className="unstaking-time">{`Unstaking time: ${unstakingTime}`}</p>
          ) : (
            undefined
          ),
      },
      {
        title: jailStatus,
        subtitle: "Jailed",
        children: jailActionItem,
      },
      {
        title: formatNetworkData(stakedTokens),
        titleAttrs: {
          title: stakedTokens ? formatNumbers(stakedTokens) : undefined,
        },
        subtitle: "Validator Power",
      },
    ];

    const serviceURLValue = status === STAKE_STATUS.Staked ? serviceURL : "";
    const contactInfo = [
      { title: "Service URL", subtitle: serviceURLValue || "" },
      { title: "Contact email", subtitle: contactEmail },
    ];

    const renderValidation = (handleFunc, breadcrumbs) => (
      <>
        {/* eslint-disable-next-line react/prop-types */}
        <ValidateKeys
          handleBreadcrumbs={this.props.onBreadCrumbChange}
          breadcrumbs={breadcrumbs}
          address={address}
          handleAfterValidate={handleFunc}
        >
          <h1>Verify private key</h1>
          <p className="validate-text">
            Please import your account credentials before sending the
            Transaction. Be aware that this Transaction has a 0.01 POKT fee
            cost.
          </p>
        </ValidateKeys>
      </>
    );

    if (ctaButtonPressed && stake) {
      return renderValidation(this.stakeNode, ["Nodes", "Stake Node"]);
    }

    if (ctaButtonPressed && unstake) {
      return renderValidation(this.unstakeNode, ["Nodes", "Unstake Node"]);
    }

    if (ctaButtonPressed && unjail) {
      return renderValidation(this.unjailNode, ["Nodes", "Unjail Node"]);
    }

    if (loading) {
      return <Loader />;
    }

    if (!exists) {
      const message = (
        <h3>
          This Node does not exist.{" "}
          <Link to={_getDashboardPath(DASHBOARD_PATHS.nodes)}>
            Go to Node List
          </Link>
        </h3>
      );

      return <AppAlert variant="danger" title={message} />;
    }

    if (deleted) {
      return (
        <DeletedOverlay
          text={
            <p>
              Your node
              <br />
              was successfully removed
            </p>
          }
          buttonText="Go to Node List"
          buttonLink={_getDashboardPath(DASHBOARD_PATHS.nodes)}
        />
      );
    }

    return (
      <div className="detail">
        {unjailAlert && (
          <AppAlert
            className="pb-4 pt-4"
            variant="primary"
            onClose={() => {
              this.setState({ unjailAlert: false });
            }}
            dismissible
            title={
              <>
                <h4 className="text-uppercase" style={{ paddingLeft: "15px" }}>
                  ATTENTION!{" "}
                </h4>
                <p className="ml-2"></p>
              </>
            }
          >
            <p
              ref={el => {
                if (el) {
                  el.style.setProperty("font-size", "14px", "important");
                }
              }}
            >
              This unjail transaction will be marked complete when the next
              block is generated. You will receive an email notification when
              your node is out of jail and ready to use.
            </p>
          </AppAlert>
        )}
        <Row>
          <Col>
            {updatingAlert && (
              <AppAlert
                className="pb-3 pt-3 mb-4"
                title={<h4 className="ml-3">ATTENTION!</h4>}
              >
                <p>
                  This staking transaction will be marked complete when the next
                  block is generated. You will receive an email notification
                  when your app is ready to use.
                </p>
              </AppAlert>
            )}
            {error.show && (
              <AppAlert
                variant="danger"
                title={error.message}
                onClose={() => this.setState({ error: { show: false } })}
                dismissible
              />
            )}
            <div className="head">
              <img className="account-icon" src={icon} alt="node-icon" />
              <div className="info">
                <h1 className="name d-flex align-items-center">{name}</h1>
                <h3 className="owner">{operator}</h3>
                <p className="description">{description}</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="11" md="11" lg="11" className="general-header page-title">
            <h1>Node Detail</h1>
          </Col>
          <Col sm="1" md="1" lg="1">
            {/*<Button
              className="float-right cta"
              disabled={updatingAlert || status === STAKE_STATUS.Unstaking || jailed}
              onClick={() => {
                this.setState({ctaButtonPressed: true});
                  
                isStaked ? this.setState({unstake: true}) : this.setState({stake: true});
              }}
              variant="primary">
              <span>{isStaked ? "Unstake" : "Stake"}</span>
            </Button>*/}
          </Col>
        </Row>
        <Row className="stats">
          {generalInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard
                titleAttrs={card.titleAttrs}
                title={card.title}
                subtitle={card.subtitle}
              >
                {card.children || <></>}
              </InfoCard>
            </Col>
          ))}
        </Row>
        <Row>
          <Col
            className={chains.length === 0 ? "mb-1" : ""}
            style={{
              display: status === STAKE_STATUS.Staked ? "block" : "none",
            }}
          >
            <Segment scroll={false} label="Networks">
              <AppTable
                scroll
                toggle={chains.length > 0}
                keyField="hash"
                data={chains}
                columns={TABLE_COLUMNS.NETWORK_CHAINS}
                bordered={false}
              />
            </Segment>
          </Col>
        </Row>
        <Row className="item-data">
          <Col sm="6" md="6" lg="6">
            <div className="page-title">
              <h2>Address</h2>
              <Alert variant="light">{address}</Alert>
            </div>
          </Col>
          <Col sm="6" md="6" lg="6">
            <div className="page-title">
              <h2>Public Key</h2>
              <Alert variant="light">{publicKey}</Alert>
            </div>
          </Col>
        </Row>
        <Row className="contact-info">
          {contactInfo.map((card, idx) => (
            <Col key={idx} sm="6" md="6" lg="6">
              <InfoCard
                className={"contact"}
                title={card.title}
                subtitle={card.subtitle}
                flexAlign="left"
              >
                <span />
              </InfoCard>
            </Col>
          ))}
        </Row>
        <Row className="action-buttons">
          <Col>
            <span className="option">
              <img src={"/assets/edit.svg"} alt="edit-action-icon" />
              <p>
                <Link
                  to={() => {
                    const url = _getDashboardPath(DASHBOARD_PATHS.nodeEdit);

                    return url.replace(":address", address);
                  }}
                >
                  Edit
                </Link>{" "}
                to change your node description.
              </p>
            </span>
            <span className="option">
              <img src={"/assets/trash.svg"} alt="trash-action-icon" />
              <p>
                <span
                  className="link"
                  onClick={() => this.setState({ deleteModal: true })}
                >
                  Remove
                </span>{" "}
                this Node from the Dashboard.
              </p>
            </span>
          </Col>
        </Row>
        <Modal
          show={deleteModal}
          onHide={() => this.setState({ deleteModal: false })}
          animation={false}
          centered
          dialogClassName="app-modal"
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <h4> Are you sure you want to remove this Node?</h4>
            Your Node will be removed from the Pocket Dashboard. However, you
            will still be able to access it through the Command Line Interface
            (CLI) or import it back into Pocket Dashboard with the private key
            associated to the node
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="dark-button"
              onClick={() => this.setState({ deleteModal: false })}
            >
              <span>Cancel</span>
            </Button>
            <Button onClick={this.deleteNode}>
              <span>Remove</span>
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default NodeDetail;
