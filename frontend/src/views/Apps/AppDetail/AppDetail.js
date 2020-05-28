import React, {Component} from "react";
import {Alert, Badge, Button, Col, Modal, Row} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {POKT_UNSTAKING_DAYS, STAKE_STATUS, TABLE_COLUMNS} from "../../../_constants";
import ApplicationService, {PocketApplicationService} from "../../../core/services/PocketApplicationService";
import NetworkService from "../../../core/services/PocketNetworkService";
import Loader from "../../../core/components/Loader";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import DeletedOverlay from "../../../core/components/DeletedOverlay/DeletedOverlay";
import {formatDaysCountdown, formatNetworkData, getStakeStatus} from "../../../_helpers";
import {Link} from "react-router-dom";
import PocketUserService from "../../../core/services/PocketUserService";
import AppTable from "../../../core/components/AppTable";
import AppAlert from "../../../core/components/AppAlert";
import ValidateKeys from "../../../core/components/ValidateKeys/ValidateKeys";
import Segment from "../../../core/components/Segment/Segment";
import "../../../scss/Views/Detail.scss";
import PocketAccountService from "../../../core/services/PocketAccountService";

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
      message: "",
      purchase: true,
      hideTable: false,
      exists: true,
      unstake: false,
      stake: false,
      ctaButtonPressed: false,
    };

    this.deleteApplication = this.deleteApplication.bind(this);
    this.unstakeApplication = this.unstakeApplication.bind(this);
    this.stakeApplication = this.stakeApplication.bind(this);
  }

  async componentDidMount() {
    let message;
    let purchase = true;

    // eslint-disable-next-line react/prop-types
    if (this.props.location.state) {
      // eslint-disable-next-line react/prop-types
      message = this.props.location.state.message;
      // eslint-disable-next-line react/prop-types
      purchase = this.props.location.purchase;
    }

    // eslint-disable-next-line react/prop-types
    const {address} = this.props.match.params;

    const {
      pocketApplication,
      networkData,
    } = await ApplicationService.getApplication(address);

    if (pocketApplication === undefined) {
      this.setState({loading: false, exists: false});
      return;
    }

    const {balance: accountBalance} = await PocketAccountService.getPoktBalance(address);
    const chains = await NetworkService.getNetworkChains(networkData.chains);
    const {freeTier} = pocketApplication;

    let aat;

    if (freeTier) {
      aat = await ApplicationService.getFreeTierAppAAT(address);
    }

    this.setState({
      message,
      purchase,
      pocketApplication,
      networkData,
      chains,
      aat,
      accountBalance,
      loading: false,
    });
  }

  async deleteApplication() {
    const {address} = this.state.pocketApplication.publicPocketAccount;
    const appsLink = `${window.location.origin}${_getDashboardPath(
      DASHBOARD_PATHS.apps
    )}`;
    const userEmail = PocketUserService.getUserInfo().email;

    const success = await ApplicationService.deleteAppFromDashboard(
      address, userEmail, appsLink
    );

    if (success) {
      this.setState({deleted: true});
    }
  }

  async unstakeApplication({privateKey, passphrase, address}) {
    const {freeTier} = this.state.pocketApplication;

    const url = _getDashboardPath(DASHBOARD_PATHS.appDetail);
    const detail = url.replace(":address", address);
    const link = `${window.location.origin}${detail}`;
    const application = {privateKey, passphrase, accountAddress: address};

    const {success, data} = freeTier
      ? await ApplicationService.unstakeFreeTierApplication(application)
      : await ApplicationService.unstakeApplication(application, link);

    if (success) {
      window.location.reload();
    } else {
      this.setState({unstake: false, ctaButtonPressed: false, message: data});
    }
  }

  async stakeApplication({privateKey, passphrase, address}) {
    ApplicationService.removeAppInfoFromCache();
    ApplicationService.saveAppInfoInCache({address, privateKey, passphrase});

    // eslint-disable-next-line react/prop-types
    this.props.history.push(
      _getDashboardPath(DASHBOARD_PATHS.applicationChainsList)
    );
  }

  render() {
    const {
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
      message,
      exists,
      unstake,
      stake,
      ctaButtonPressed,
      accountBalance,
    } = this.state;

    const unstakingTime = status === STAKE_STATUS.Unstaking
      ? formatDaysCountdown(unstakingCompletionTime, POKT_UNSTAKING_DAYS)
      : undefined;

    const generalInfo = [
      {
        title: `${formatNetworkData(stakedTokens)} POKT`,
        subtitle: "Staked tokens",
      },
      {
        title: `${formatNetworkData(freeTier ? 0 : accountBalance)} POKT`,
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
      {title: formatNetworkData(maxRelays), subtitle: "Max Relays Per Day"},
    ];

    const contactInfo = [
      {title: "Website", subtitle: url},
      {title: "Contact email", subtitle: contactEmail},
    ];

    let aatStr = "";

    const renderValidation = (handleFunc) => (
      <ValidateKeys address={address} handleAfterValidate={handleFunc}>
        <h1>Confirm private key</h1>
        <p>
          Import to the dashboard a pocket account previously created as an app
          in the network. If your account is not an app go to create.
        </p>
      </ValidateKeys>
    );

    if (freeTier) {
      aatStr = PocketApplicationService.parseAAT(aat);
    }

    if (ctaButtonPressed && stake) {
      return renderValidation(this.stakeApplication);
    }

    if (ctaButtonPressed && unstake) {
      return renderValidation(this.unstakeApplication);
    }

    if (loading) {
      return <Loader/>;
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

      return <AppAlert variant="danger" title={message}/>;
    }

    if (deleted) {
      return (
        <DeletedOverlay
          text={<p>Your application<br/>was successfully removed</p>}
          buttonText="Go to App List"
          buttonLink={_getDashboardPath(DASHBOARD_PATHS.apps)}
        />
      );
    }

    return (
      <div className="detail">
        <Row>
          <Col>
            {message && (
              <AppAlert
                variant="danger"
                title={message}
                onClose={() => this.setState({message: ""})}
                dismissible/>
            )}
            <div className="head">
              <img src={icon} alt="app-icon"/>
              <div className="info">
                <h1 className="name d-flex align-items-center">
                  {name}
                  {freeTier && (
                    <Badge variant="light">
                      Free Tier
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
          <Col sm="11" md="11" lg="11" className="general-header page-title">
            <h1>General Information</h1>
          </Col>
          <Col sm="1" md="1" lg="1">
            {status !== STAKE_STATUS.Unstaking &&
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
              <InfoCard title={card.title} subtitle={card.subtitle}>
                {card.children || <br/>}
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
                <pre>
                  <code className="language-html" data-lang="html">
                    {"# Returns\n"}
                    <span id="aat">{aatStr}</span>
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
                  subtitle={card.subtitle}>
                  <span/>
                </InfoCard>
              </Col>
            ))}
          </Row>}
        <Row className="action-buttons">
          <Col sm="3" md="3" lg="3">
            <span className="option">
                <img src={"/assets/edit.svg"} alt="edit-action-icon"/>
                <p>
                  <Link
                    to={() => {
                      const url = _getDashboardPath(DASHBOARD_PATHS.editApp);

                      return url.replace(":address", address);
                    }}>
                    Edit
                  </Link>{" "}
                  to change your app description.
                </p>
              </span>
          </Col>
          <Col sm="3" md="3" lg="3">
            <span className="option">
                <img src={"/assets/trash.svg"} alt="trash-action-icon"/>
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
            However, you will be able access it through the command line interface (CLI) or import it
            back into Pocket Dashboard with the private key assigned to it.
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
