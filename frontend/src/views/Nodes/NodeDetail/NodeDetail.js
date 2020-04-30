import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {Alert, Button, Col, Modal, Row} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {NETWORK_TABLE_COLUMNS} from "../../../_constants";
import NetworkService from "../../../core/services/PocketNetworkService";
import Loader from "../../../core/components/Loader";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import DeletedOverlay from "../../../core/components/DeletedOverlay/DeletedOverlay";
import "../../Apps/AppDetail/AppDetail.scss";
import NodeService from "../../../core/services/PocketNodeService";
import {getBondStatus} from "../../../_helpers";

class NodeDetail extends Component {
  constructor(props, context) {
    super(props, context);

    this.deleteNode = this.deleteNode.bind(this);
    this.unstakeNode = this.unstakeNode.bind(this);
    this.unjailNode = this.unjailNode.bind(this);

    this.state = {
      pocketNode: {},
      networkData: {},
      chains: [],
      loading: true,
      deleteModal: false,
      deleted: false,
    };
  }

  async unjailNode() {
    const {address} = this.state.pocketNode.publicPocketAccount;

    const {success} = await NodeService.unjailNode(address);

    // TODO: Show message on frontend on success/failure
    if (success) {
      console.log("Node successfully unjailed");
    } else {
      console.log("There was an error unjailing the node");
    }
  }

  async deleteNode() {
    const {address} = this.state.pocketNode.publicPocketAccount;

    const success = await NodeService.deleteNodeFromDashboard(address);

    if (success) {
      this.setState({deleted: true});
    }
  }

  async unstakeNode() {
    const {address} = this.state.pocketNode.publicPocketAccount;

    const success = NodeService.unstakeNode(address);

    /* TOOD: Show message on success/failure */
    if (success) {
    } else {
    }
  }

  async componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const {address} = this.props.match.params;

    const {pocketNode, networkData} = await NodeService.getNode(address);

    const chains = await NetworkService.getNetworkChains(networkData.chains);

    this.setState({
      pocketNode,
      networkData,
      chains,
      loading: false,
    });
  }

  render() {
    const {
      name,
      contactEmail,
      description,
      icon,
      publicPocketAccount,
    } = this.state.pocketNode;
    const {stakedTokens, status, jailed} = this.state.networkData;

    const address = publicPocketAccount
      ? publicPocketAccount.address
      : undefined;

    const publicKey = publicPocketAccount
      ? publicPocketAccount.publicKey
      : undefined;

    const {chains, loading, deleteModal, deleted} = this.state;

    const generalInfo = [
      {title: `${stakedTokens} POKT`, subtitle: "Stake tokens"},
      {title: getBondStatus(status), subtitle: "Stake status"},
    ];

    const contactInfo = [{title: contactEmail, subtitle: "Email"}];

    if (loading) {
      return <Loader />;
    }

    if (deleted) {
      return (
        <DeletedOverlay
          text="You node was succesfully removed"
          buttonText="Go to nodes list"
          buttonLink={_getDashboardPath(DASHBOARD_PATHS.nodes)}
        />
      );
    }

    return (
      <div id="app-detail">
        <Row>
          <Col>
            <div className="head">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <img src={icon} />
              <div className="info">
                <h1 className="d-flex align-items-baseline">{name}</h1>
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
          <Col>
            <InfoCard title={jailed === 1 ? "YES" : "NO"} subtitle={"Jailed"}>
              {jailed ? (
                <Button
                  variant="link"
                  onClick={this.unjailNode}
                  className="link pt-0 pb-0"
                >
                  Take out of jail
                </Button>
              ) : (
                <br />
              )}
            </InfoCard>
          </Col>
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
          <Col lg="12" md="12">
            <div className="info-section">
              <h3>Address</h3>
              <Alert variant="dark">{address}</Alert>
            </div>
            <div className="info-section">
              <h3>Public Key</h3>
              <Alert variant="dark">{publicKey}</Alert>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Networks</h3>
            <BootstrapTable
              classes="app-table table-striped"
              keyField="hash"
              data={chains}
              columns={NETWORK_TABLE_COLUMNS}
              bordered={false}
            />
          </Col>
        </Row>
        <Row className="mt-3 mb-4">
          <Col className="action-buttons">
            <div className="main-options">
              <Button variant="dark" className="pr-4 pl-4">
                Unstake
              </Button>
              <Button variant="secondary" className="ml-3 pr-4 pl-4">
                New Purchase
              </Button>
            </div>
            <Button
              onClick={() => this.setState({deleteModal: true})}
              variant="link"
              className="link mt-3"
            >
              Delete Node
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
            <Modal.Title>
              Are you sure you want to delete this Node?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This action is irreversible, if you delete it you will never be able
            to access it again
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="light"
              className="pr-4 pl-4"
              onClick={this.deleteNode}
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

export default NodeDetail;
