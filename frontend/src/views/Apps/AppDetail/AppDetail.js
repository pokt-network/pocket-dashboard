import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Alert, Badge, Button, Col, Modal, Row} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {STAKE_STATUS, TABLE_COLUMNS} from "../../../_constants";
import ApplicationService, {PocketApplicationService} from "../../../core/services/PocketApplicationService";
import NetworkService from "../../../core/services/PocketNetworkService";
import Loader from "../../../core/components/Loader";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import DeletedOverlay from "../../../core/components/DeletedOverlay/DeletedOverlay";
import {formatNetworkData, getStakeStatus} from "../../../_helpers";
import {Link} from "react-router-dom";
import PocketUserService from "../../../core/services/PocketUserService";
import moment from "moment";
import "./AppDetail.scss";
import Segment from "../../../core/components/Segment/Segment";

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

    const chains = await NetworkService.getAvailableNetworkChains(
      networkData.chains
    );

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
    const isStaked = status !== STAKE_STATUS.Unstaked && status !== STAKE_STATUS.Unstaking;

    let address;
    let publicKey;

    if (publicPocketAccount) {
      address = publicPocketAccount.address;
      publicKey = publicPocketAccount.publicKey;
    }

    const {chains, aat, loading, deleteModal, deleted, message} = this.state;

    const generalInfo = [
      {
        title: `${formatNetworkData(stakedTokens)} POKT`,
        subtitle: "Staked tokens",
      },
      // TODO: Change this value.
      {
        title: `${formatNetworkData(2000000)} POKT`,
        subtitle: "Balance"
      },
      {
        title: status,
        subtitle: "Stake Status",
        children:
          status === STAKE_STATUS.Unstaking ? (
            <p className="unstaking-time">{`Unstaking time: ${moment
              .duration({seconds: unstakingCompletionTime})
              .humanize()}`}</p>
          ) : undefined,
      },
      {title: formatNetworkData(maxRelays), subtitle: "Max Relays Per Day"},
    ];

    const contactInfo = [
      {title: "Website", subtitle: url},
      {title: "Contact email", subtitle: contactEmail},
    ];

    let aatStr = "";

    if (freeTier) {
      aatStr = PocketApplicationService.parseAAT(aat);
    }

    if (loading) {
      return <Loader/>;
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
      <div className="app-detail">
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
            <Button
              className="float-right cta"
              onClick={isStaked ? this.unstakeApplication : this.stakeApplication}
              variant="primary">
              <span>{isStaked ? "Unstake" : "Stake"}</span>
            </Button>
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
          <Col>
            <Segment label="Networks">
              <BootstrapTable
                classes="app-table"
                keyField="hash"
                Purch
                data={chains}
                columns={TABLE_COLUMNS.NETWORK_CHAINS}
                bordered={false}
              />
            </Segment>
          </Col>
        </Row>
        <Row className="app-data">
          <Col>
            <div className="page-title">
              <h2>Address</h2>
              <Alert variant="light">{address}</Alert>
            </div>
          </Col>
          <Col>
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
          size="sm"
          className="app-modal"
          show={deleteModal}
          onHide={() => this.setState({deleteModal: false})}
          animation={false}
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete this App?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
