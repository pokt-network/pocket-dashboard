/* eslint-disable react/prop-types */
import React, {Component} from "react";
import {Alert, Badge, Button, Col, Modal, Row} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {BACKEND_ERRORS, DEFAULT_NETWORK_ERROR_MESSAGE, STAKE_STATUS, TABLE_COLUMNS} from "../../../_constants";
import ApplicationService, {PocketApplicationService} from "../../../core/services/PocketApplicationService";
import NetworkService from "../../../core/services/PocketNetworkService";
import Loader from "../../../core/components/Loader";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import DeletedOverlay from "../../../core/components/DeletedOverlay/DeletedOverlay";
import {formatDaysCountdown, getStakeStatus, formatNumbers, formatNetworkData} from "../../../_helpers";
import {Link} from "react-router-dom";
import PocketUserService from "../../../core/services/PocketUserService";
import AppTable from "../../../core/components/AppTable";
import AppAlert from "../../../core/components/AppAlert";
import ValidateKeys from "../../../core/components/ValidateKeys/ValidateKeys";
import Segment from "../../../core/components/Segment/Segment";
import "../../../scss/Views/Detail.scss";
import PocketAccountService from "../../../core/services/PocketAccountService";
import PocketClientService from "../../../core/services/PocketClientService";

class AppDetail extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pocketApplication: {},
      networkData: {},
      accountBalance: 0,
      chains: [],
      aat: {},
      loading: true,
      deleteModal: false,
      deleted: false,
      hideTable: false,
      exists: true,
      unstake: false,
      stake: false,
      ctaButtonPressed: false,
      isFreeTier: false,
      freeTierMsg: false,
      updatingAlert: false,
      error: {show: false, message: ""}
    };

    this.deleteApplication = this.deleteApplication.bind(this);
    this.unstakeApplication = this.unstakeApplication.bind(this);
    this.stakeApplication = this.stakeApplication.bind(this);
    this.copyAAT = this.copyAAT.bind(this);
  }

  copyAAT() {
    const aatInput = document.getElementById("aat-value");

    if (aatInput) {
      aatInput.select();
      aatInput.setSelectionRange(0, 99999); /*For mobile devices*/

      document.execCommand("copy");
    }
  }

  async componentDidMount() {
    // eslint-disable-next-line
    let freeTierMsg = false;
    let hasError = false;
    let errorType = "";

    if (this.props.location.state) {
      freeTierMsg = this.props.location.state.freeTierMsg;
    }

    const {id} = this.props.match.params;

    const {
      pocketApplication,
      networkData,
      error,
      name,
    } = await ApplicationService.getClientApplication(id) || {};

    hasError = error ? error : hasError;
    errorType = error ? name : errorType;

    if (hasError || pocketApplication === undefined) {
      if (errorType === BACKEND_ERRORS.NETWORK) {
        this.setState({
          loading: false, error: {
            show: true, message: DEFAULT_NETWORK_ERROR_MESSAGE
          }
        });
      } else {
        this.setState({loading: false, exists: false});
      }
      return;
    }

    const clientAddress = pocketApplication.freeTierApplicationAccount.address !== "" && pocketApplication.freeTierApplicationAccount.address !== undefined ? pocketApplication.freeTierApplicationAccount.address : pocketApplication.publicPocketAccount.address;
    let accountBalance;

    if (clientAddress) {
      const {balance} = await PocketAccountService.getPoktBalance(clientAddress);

      accountBalance = balance;
    } else {
      accountBalance = 0;
    }

    const chains = await NetworkService.getNetworkChains(networkData.chains);
    const {freeTier, freeTierAAT} = pocketApplication;

    const status = getStakeStatus(parseInt(networkData.status));
    const updatingAlert = pocketApplication.updatingStatus && status === STAKE_STATUS.Unstaked;

    this.setState({
      pocketApplication,
      networkData,
      chains,
      aat: freeTierAAT,
      accountBalance,
      isFreeTier: freeTier,
      freeTierMsg,
      updatingAlert,
      loading: false,
    });

    // eslint-disable-next-line react/prop-types
    this.props.onBreadCrumbChange(["Apps", "App Detail"]);
  }

  async deleteApplication() {
    const {id} = this.state.pocketApplication;

    const appsLink = `${window.location.origin}${_getDashboardPath(
      DASHBOARD_PATHS.apps
    )}`;
    const userEmail = PocketUserService.getUserInfo().email;

    try {
      const success = await ApplicationService.deleteAppFromDashboard(
        id, userEmail, appsLink
      );

      if (success) {
        this.setState({deleted: true});
        // eslint-disable-next-line react/prop-types
        this.props.onBreadCrumbChange(["Apps", "App Detail", "App Removed"]);
      }
    } catch (error) {
      this.setState({deleteModal: false, error: {show: true, message: "Free tier apps can't be deleted."}});
    }
  }

  async unstakeApplication({ppk, passphrase}) {
    const {freeTier, id} = this.state.pocketApplication;
    const {address} = this.state.pocketApplication.publicPocketAccount;

    const url = _getDashboardPath(DASHBOARD_PATHS.appDetail);
    const detail = url.replace(":id", id);
    const link = `${window.location.origin}${detail}`;

    await PocketClientService.saveAccount(JSON.stringify(ppk), passphrase);

    const unstakeInformation = {
      application_id: id
    };

    if (freeTier) {
      // Create unstake transaction
      const {success, data} = await ApplicationService.unstakeFreeTierApplication(unstakeInformation, link);

      if (success) {
        window.location.reload(false);
      } else {
        this.setState({unstake: false, ctaButtonPressed: false, message: data});
      }
    } else {
      const appUnstakeTransaction = await PocketClientService.appUnstakeRequest(address, passphrase);

      const {success, data} = await ApplicationService.unstakeApplication(appUnstakeTransaction, link);

      if (success) {
        window.location.reload(false);
      } else {
        this.setState({unstake: false, ctaButtonPressed: false, message: data});
      }
    }
  }

  async stakeApplication({ppk, passphrase, address}) {
    const {id} = this.state.pocketApplication;

    ApplicationService.removeAppInfoFromCache();
    ApplicationService.saveAppInfoInCache({applicationID: id, address, passphrase});

    await PocketClientService.saveAccount(JSON.stringify(ppk), passphrase);

    PocketUserService.saveUserAction("Stake App");

    // eslint-disable-next-line react/prop-types
    this.props.history.push(
      _getDashboardPath(DASHBOARD_PATHS.applicationChainsList)
    );
  }

  render() {
    const {
      id,
      name,
      url,
      contactEmail,
      owner,
      description,
      icon,
      freeTier,
      publicPocketAccount,
    } = this.state.pocketApplication;

    const {
      max_relays: maxRelays,
      staked_tokens: stakedTokens,
      status: stakeStatus,
      unstaking_time: unstakingCompletionTime,
    } = this.state.networkData;

    const status = getStakeStatus(parseInt(stakeStatus));
    const isStaked =
      status !== STAKE_STATUS.Unstaked && status !== STAKE_STATUS.Unstaking;

    let address;
    let publicKey;

    if (publicPocketAccount) {
      address = publicPocketAccount.address;
      publicKey = publicPocketAccount.publicKey;
    }

    const {
      chains,
      aat,
      loading,
      deleteModal,
      deleted,
      error,
      exists,
      unstake,
      stake,
      ctaButtonPressed,
      accountBalance,
      freeTierMsg,
      isFreeTier,
      updatingAlert,
      pocketApplication
    } = this.state;

    const unstakingTime = status === STAKE_STATUS.Unstaking
      ? formatDaysCountdown(unstakingCompletionTime)
      : undefined;

    const generalInfo = [
      {
        title: `${formatNetworkData(stakedTokens, false)} POKT`,
        titleAttrs: {title: stakedTokens ? formatNumbers(stakedTokens) : undefined},
        subtitle: "Staked tokens",
      },
      {
        title: `${formatNetworkData(freeTier ? 0 : accountBalance)} POKT`,
        titleAttrs: {title: maxRelays && !freeTier ? formatNumbers(accountBalance) : undefined},
        subtitle: "Balance"
      },
      {
        title: status,
        subtitle: "Stake Status",
        children:
          status === STAKE_STATUS.Unstaking ? (
            <p className="unstaking-time">{`Unstaking time: ${unstakingTime}`}</p>
          ) : undefined,
      },
      {
        title: formatNumbers(maxRelays * 24),
        titleAttrs: {title: maxRelays * 24 ? formatNumbers(maxRelays * 24) : undefined},
        subtitle: "Max Relays Per Day"
      },
    ];

    const contactInfo = [
      {title: "Website", subtitle: url},
      {title: "Contact email", subtitle: contactEmail},
    ];

    let aatStr = "";

    const renderValidation = (handleFunc, breadcrumbs) => (
      <>
        {/* eslint-disable-next-line react/prop-types */}
        <ValidateKeys handleBreadcrumbs={this.props.onBreadCrumbChange}
          breadcrumbs={breadcrumbs}
          address={address} handleAfterValidate={handleFunc}>
          <h1>Confirm private key</h1>
          <p>
            Import to the dashboard a pocket account previously created as an app
            in the network. If your account is not an app go to create.
        </p>
        </ValidateKeys>
      </>
    );

    if (freeTier && aat) {
      const aatInput = document.getElementById("aat-value");

      if (aatInput) {
        aatInput.value = JSON.stringify(aat);
      }
      aatStr = PocketApplicationService.parseAAT(aat);
    }

    if (ctaButtonPressed && stake) {
      return renderValidation(this.stakeApplication, ["Apps", "Stake App"]);
    }

    if (ctaButtonPressed && unstake) {
      return renderValidation(this.unstakeApplication, ["Apps", "Unstake App"]);
    }

    if (loading) {
      return <Loader />;
    }

    if (!exists) {
      const message = (
        <h3>
          This application does not exist.{" "}
          <Link to={_getDashboardPath(DASHBOARD_PATHS.apps)}>
            Go to App List
          </Link>
        </h3>
      );

      return <AppAlert variant="danger" title={message} />;
    }

    if (deleted) {
      return (
        <DeletedOverlay
          text={<p style={{
            position: "absolute",
            top: "40%",
            left: "42.3%"
          }}>Your application<br />was successfully removed</p>}
          buttonText="Go to App List"
          buttonLink={_getDashboardPath(DASHBOARD_PATHS.apps)}
        />
      );
    }

    return (
      <div className="detail">
        <Row>
          <Col>
            {(freeTierMsg || updatingAlert) && (
              <AppAlert
                className="pb-3 pt-3 mb-4"
                title={
                  <h4 className="ml-3">
                    ATTENTION!
                  </h4>
                }
              >
                <p>
                  This staking transaction will be marked complete when the next block is generated. You will receive an email notification when your app is ready to use.
                </p>
              </AppAlert>
            )}
            {error.show && (
              <AppAlert
                variant="danger"
                title={error.message}
                onClose={() => this.setState({error: {show: false}})}
                dismissible />
            )}
            <div className="head">
              <img className="account-icon" src={icon} alt="app-icon" />
              <div className="info">
                <h1 className="name d-flex align-items-center">
                  {name}
                  {freeTier && (
                    <Badge variant="light">
                      Launch Offering Plan
                    </Badge>
                  )}
                </h1>
                <h3 className="owner">{owner}</h3>
                <p className="description">{description}</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="8" md="8" lg="8" className="general-header page-title">
            <h1>App Detail</h1>
          </Col>
          <Col
            sm="4"
            className="d-flex align-items-center justify-content-end cta-buttons"
          >
            {status === STAKE_STATUS.Staked &&
              <Link
                to={() => {
                  const url = _getDashboardPath(DASHBOARD_PATHS.generalSettings);

                  return url.replace(":id", id);
                }}>
                <Button className="ml-5 mr-4" variant="dark" style={{width: "120px"}}>
                  <span>Gateway Settings</span>
                </Button>
              </Link>
            }
            {status !== STAKE_STATUS.Unstaking && freeTier === false && pocketApplication.updatingStatus !== true &&
              <Button
                className="float-right cta"
                onClick={() => {
                  this.setState({ctaButtonPressed: true});
                  isStaked ? this.setState({unstake: true}) : this.setState({stake: true});
                }}
                variant="primary">
                <span>{isStaked ? "Unstake" : "Stake"}</span>
              </Button>
            }
          </Col>
        </Row>
        <Row className="stats">
          {generalInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard titleAttrs={card.titleAttrs} title={card.title} subtitle={card.subtitle}>
                {card.children || <></>}
              </InfoCard>
            </Col>
          ))}
        </Row>
        <Row>
          <Col className={chains.length === 0 ? "mb-1" : ""}>
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
        {freeTier ? (
          <Row>
            <Col sm="6" md="6" lg="6">
              <div id="aat-info" className="page-title">
                <h2>AAT</h2>
              </div>
              <Alert variant="light" className="aat-code">
                <span id="aat-copy" className="copy-button" onClick={this.copyAAT}> <img src={"/assets/copy.png"} alt="copy" /></span>
                <pre>
                  <input id="aat-value" style={{position: "absolute", left: "-9999px"}}></input>
                  <code className="language-html" data-lang="html">
                    {"# Returns\n"}
                    <span id="aat" >{aatStr}</span>
                  </code>
                </pre>
              </Alert>
            </Col>
            <Col sm="6" md="6" lg="6">
              <div className="free-tier-contact-info">
                {contactInfo.map((card, idx) => (
                  <div key={idx}>
                    <h3>{card.title}</h3>
                    <span>{card.subtitle}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        ) :
          <Row className="contact-info">
            {contactInfo.map((card, idx) => (
              <Col key={idx} sm="6" md="6" lg="6">
                <InfoCard
                  className={"contact"}
                  title={card.title}
                  subtitle={card.subtitle}
                  flexAlign="flex-start"
                >
                  <span />
                </InfoCard>
              </Col>
            ))}
          </Row>}
        <Row className="action-buttons">
          <Col>
            <span className="option">
              <img src={"/assets/edit.svg"} alt="edit-action-icon" />
              <p>
                <Link
                  to={() => {
                    const url = _getDashboardPath(DASHBOARD_PATHS.editApp);

                    return url.replace(":id", id);
                  }}>
                  Edit
                  </Link>{" "}
                  to change your app description.
                </p>
            </span>
            <span style={{display: isFreeTier ? "none" : "inline-block"}} className="option">
              <img src={"/assets/trash.svg"} alt="trash-action-icon" />
              <p>
                <span
                  className="link"
                  onClick={() => this.setState({deleteModal: true})}>
                  Remove
                  </span>{" "}
                  this App from the Dashboard.
                </p>
            </span>
          </Col>
        </Row>
        <Modal
          show={deleteModal}
          onHide={() => this.setState({deleteModal: false})}
          animation={false}
          centered
          dialogClassName="app-modal"
        >
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <h4>Are you sure you want to remove this App?</h4>
            Your application will be removed from the Pocket Dashboard.
            However, you will still be able to access it through the Command
            Line Interface (CLI) or import it back into Pocket Dashboard with
            the private key assigned to it.
          </Modal.Body>
          <Modal.Footer>
            <Button className="dark-button" onClick={() => this.setState({deleteModal: false})}>
              <span>Cancel</span>
            </Button>
            <Button onClick={this.deleteApplication}>
              <span>Remove</span>
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AppDetail;
