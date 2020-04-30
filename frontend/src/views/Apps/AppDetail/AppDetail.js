import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Alert, Badge, Button, Col, Modal, Row} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import HelpLink from "../../../core/components/HelpLink";
import {TABLE_COLUMNS} from "../../../_constants";
import "./AppDetail.scss";
import ApplicationService, {
  PocketApplicationService,
} from "../../../core/services/PocketApplicationService";
import NetworkService from "../../../core/services/PocketNetworkService";
import Loader from "../../../core/components/Loader";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import DeletedOverlay from "../../../core/components/DeletedOverlay/DeletedOverlay";
import {copyToClickboard, getBondStatus} from "../../../_helpers";

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

    const success = await ApplicationService.deleteAppFromDashboard(address);

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

  render() {
    const {
      name,
      url,
      contactEmail,
      description,
      icon,
      freeTier,
      publicPocketAccount,
    } = this.state.pocketApplication;
    const {maxRelays, stakedTokens, status} = this.state.networkData;

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
      purchase,
      message,
    } = this.state;

    const generalInfo = [
      {title: `${staked_tokens} POKT`, subtitle: "Stake tokens"},
      {title: getBondStatus(status), subtitle: "Stake status"},
      {title: max_relays, subtitle: "Max Relays"},
    ];

    const contactInfo = [
      {title: url, subtitle: "URL"},
      {title: contactEmail, subtitle: "Email"},
    ];

    let aatStr = "";

    if (freeTier) {
      aatStr = PocketApplicationService.parseAAT(aat);
    }

    if (loading) {
      return <Loader />;
    }

    if (deleted) {
      return (
        <DeletedOverlay
          text="You application was succesfully removed"
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
              <img src={icon} />
              <div className="info">
                <h1 className="d-flex align-items-baseline">
                  {name}
                  {freeTier && (
                    <Badge variant="dark" className="ml-2 pt-2 pb-2 pl-3 pr-3">
                      Free Tier
                    </Badge>
                  )}
                </h1>
                <p className="description">{description}</p>
              </div>
            </div>
          </Col>
        </Row>
        <h2 className="mt-4">General Information</h2>
        <Row className="mt-2 stats">
          {generalInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard title={card.title} subtitle={card.subtitle} />
            </Col>
          ))}
        </Row>
        <Row className="contact-info stats">
          {contactInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard
                className="pl-4"
                title={card.title}
                subtitle={card.subtitle}
              >
                <span />
              </InfoCard>
            </Col>
          ))}
        </Row>
        <Row className="mt-3">
          <Col lg={freeTier ? 6 : 12} md={freeTier ? 6 : 12}>
            <div className="info-section">
              <h3>Address</h3>
              <Alert variant="dark">{address}</Alert>
            </div>
            <div className="info-section">
              <h3>Public Key</h3>
              <Alert variant="dark">{publicKey}</Alert>
            </div>
          </Col>
          {freeTier && (
            <Col lg="6" md="6">
              <div id="aat-info" className="mb-2">
                <h3>AAT</h3>
                <span>
                  <HelpLink size="2x" />
                  <p>How to create an AAT?</p>
                </span>
              </div>
              <div className="aat-code">
                <pre>
                  <code className="language-html" data-lang="html">
                    {"# Returns\n"}
                    <span id="aat">{aatStr}</span>
                  </code>
                  <p
                    onClick={() =>
                      copyToClickboard(JSON.stringify(aat, null, 2))
                    }
                  >
                    Copy
                  </p>
                </pre>
              </div>
            </Col>
          )}
        </Row>
        <Row>
          <Col>
            <h3>Networks</h3>
            <BootstrapTable
              classes="table app-table table-striped"
              keyField="hash"
              Purch
              data={chains}
              columns={TABLE_COLUMNS.NETWORK_CHAINS}
              bordered={false}
            />
          </Col>
        </Row>
        <Row className="mt-3 mb-4">
          <Col className="action-buttons">
            <div className="main-options">
              <Button
                onClick={this.unstakeApplication}
                variant="dark"
                className="pr-4 pl-4"
              >
                Unstake
              </Button>
              <Button
                variant="secondary"
                className="ml-3 pr-4 pl-4"
                disabled={!purchase}
              >
                New Purchase
              </Button>
            </div>
            <Button
              onClick={() => this.setState({deleteModal: true})}
              variant="link"
              className="link mt-3"
            >
              Delete App
            </Button>
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
