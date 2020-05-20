import React, {Component} from "react";
import {Alert, Badge, Button, Col, Modal, Row} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {STAKE_STATUS, TABLE_COLUMNS} from "../../../_constants";
import "./AppDetail.scss";
import ApplicationService, {
  PocketApplicationService,
} from "../../../core/services/PocketApplicationService";
import NetworkService from "../../../core/services/PocketNetworkService";
import Loader from "../../../core/components/Loader";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import DeletedOverlay from "../../../core/components/DeletedOverlay/DeletedOverlay";
import {
  copyToClipboard,
  formatNetworkData,
  getStakeStatus,
  formatNumbers,
} from "../../../_helpers";
import {Link} from "react-router-dom";
import PocketUserService from "../../../core/services/PocketUserService";
import moment from "moment";
import AppTable from "../../../core/components/AppTable";
import AppAlert from "../../../core/components/AppAlert";

class AppDetail extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pocketApplication: {},
      networkData: {},
      chains: [],
      aat: {},
      loading: true,
      deleteModal: false,
      deleted: false,
      message: "",
      purchase: true,
      hideTable: false,
      exists: true,
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

    const chains = await NetworkService.getNetworkChains(networkData.chains);

    const {freeTier} = pocketApplication;

    let aat;

    if (freeTier) {
      const {address} = pocketApplication.publicPocketAccount;

      aat = await ApplicationService.getFreeTierAppAAT(address);
    }

    this.setState({
      message,
      purchase,
      pocketApplication,
      networkData,
      chains,
      aat,
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

  async unstakeApplication() {
    const {address} = this.state.pocketApplication.publicPocketAccount;
    const {freeTier} = this.state.pocketApplication;

    if (freeTier) {
      const success = await ApplicationService.unstakeFreeTierApplication(
        address
      );

      if (success) {
        // TODO: Show message on frontend about success
      }
    } else {
      // TODO: Integrate unstake for custom tier apps
    }
  }

  async stakeApplication() {
    // TODO: Implement
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
      maxRelays,
      stakedTokens,
      status: bondStatus,
      unstakingCompletionTime,
    } = this.state.networkData;
    const status = getStakeStatus(bondStatus);
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
    } = this.state;

    const generalInfo = [
      {
        title: `${formatNetworkData(stakedTokens)} POKT`,
        subtitle: "Stake tokens",
      },
      {title: formatNumbers(2000), subtitle: "Balance"},
      {
        title: status,
        subtitle: "Stake status",
        children:
          status === STAKE_STATUS.Unstaking ? (
            <p className="unstaking-time">{`Unstaking time: ${moment
              .duration({seconds: unstakingCompletionTime})
              .humanize()}`}</p>
          ) : undefined,
      },
      // TODO: Get
      {title: formatNetworkData(maxRelays), subtitle: "Max Relays Per Day"},
    ];

    const contactInfo = [
      {title: url, subtitle: freeTier ? "Website" : "Service URL"},
      {title: contactEmail, subtitle: "Contact email"},
    ];

    let aatStr = "";

    if (freeTier) {
      aatStr = PocketApplicationService.parseAAT(aat);
    }

    if (loading) {
      return <Loader />;
    }

    if (!exists) {
      const message = (
        <h3>
          This application does not exist.{" "}
          <Link to={_getDashboardPath(DASHBOARD_PATHS.apps)}>
            Go to applications list.
          </Link>
        </h3>
      );

      return <AppAlert variant="danger" title={message} />;
    }

    if (deleted) {
      return (
        <DeletedOverlay
          text="You application was successfully removed"
          buttonText="Go to apps list"
          buttonLink={_getDashboardPath(DASHBOARD_PATHS.apps)}
        />
      );
    }

    return (
      <div id="app-detail">
        <Row>
          <Col>
            {message && (
              <Alert
                variant="secondary"
                onClose={() => this.setState({message: ""})}
                dismissible
              >
                {message}
              </Alert>
            )}
            <div className="head">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={icon} className="mr-3" />
              <div className="info">
                <h1 className="name d-flex align-items-center">
                  {name}
                  {freeTier && (
                    <Badge variant="light" className="ml-2 pl-3 pr-3">
                      Free Tier
                    </Badge>
                  )}
                </h1>
                <h3 className="owner mb-1">{owner}</h3>
                <p className="description">{description}</p>
              </div>
            </div>
          </Col>
        </Row>
        <div className="title-page">
          <h3 className="mt-4">General Information</h3>
          <Button
            className="float-right cta"
            onClick={isStaked ? this.unstakeApplication : this.stakeApplication}
            variant="primary"
          >
            {isStaked ? "Unstake" : "Stake"}
          </Button>
        </div>
        <Row className="mt-2 mb-4 stats">
          {generalInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard title={card.title} subtitle={card.subtitle}>
                {card.children || <br />}
              </InfoCard>
            </Col>
          ))}
        </Row>
        <Row>
          <Col className="title-page mt-2 mb-4">
            <h4 className="ml-2">Networks</h4>
            <AppTable
              scroll
              toggle={chains.length > 0}
              keyField="hash"
              data={chains}
              columns={TABLE_COLUMNS.NETWORK_CHAINS}
              bordered={false}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="title-page">
              <h4 className="ml-3">Address</h4>
              <Alert variant="light">{address}</Alert>
            </div>
          </Col>
          <Col>
            <div className="title-page">
              <h4 className="ml-3">Public Key</h4>
              <Alert variant="light">{publicKey}</Alert>
            </div>
          </Col>
        </Row>
        <Row className="mt-3 contact-info stats">
          {freeTier && (
            <Col>
              <div id="aat-info" className="title-page mb-2">
                <h4 className="ml-3">AAT</h4>
              </div>
              <Alert variant="light" className="aat-code">
                <pre>
                  <code className="language-html" data-lang="html">
                    {"# Returns\n"}
                    <span id="aat">{aatStr}</span>
                  </code>
                  <p
                    onClick={() =>
                      copyToClipboard(JSON.stringify(aat, null, 2))
                    }
                  >
                    Copy
                  </p>
                </pre>
              </Alert>
            </Col>
          )}
          <Col>
            <Row className="contact-info stats">
              {contactInfo.map((card, idx) => (
                <Col
                  className={freeTier ? "free-tier" : ""}
                  lg={freeTier ? "12" : "6"}
                  key={idx}
                >
                  <InfoCard
                    className={"pl-4 contact"}
                    title={card.subtitle}
                    subtitle={card.title}
                  >
                    <span />
                  </InfoCard>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        <Row className="mt-3 mb-4">
          <Col>
            <div className="action-buttons">
              <span className="option">
                <img src="/assets/edit.svg" alt="" className="icon" />
                <p>
                  <Link
                    to={() => {
                      const url = _getDashboardPath(DASHBOARD_PATHS.editApp);

                      return url.replace(":address", address);
                    }}
                  >
                    Edit
                  </Link>{" "}
                  to change your app description.
                </p>
              </span>
              <span className="option">
                <img src="/assets/trash.svg" alt="" className="icon" />
                <p>
                  <span
                    className="link"
                    onClick={() => this.setState({deleteModal: true})}
                  >
                    Remove
                  </span>{" "}
                  this App from the Dashboard.
                </p>
              </span>
            </div>
          </Col>
        </Row>
        <Modal
          className="app-modal"
          show={deleteModal}
          onHide={() => this.setState({deleteModal: false})}
          animation={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete this App?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This action is irreversible, if you delete it you will never be able
            to access it again
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="light"
              className="pr-4 pl-4"
              onClick={this.deleteApplication}
            >
              Delete
            </Button>
            <Button
              variant="dark"
              className="pr-4 pl-4"
              onClick={() => this.setState({deleteModal: false})}
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AppDetail;
