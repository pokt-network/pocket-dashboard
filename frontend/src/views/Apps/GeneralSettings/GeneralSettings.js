/* eslint-disable react/prop-types */
import React, {Component} from "react";
import {Alert, Form, Col, Row, Modal, Button, Dropdown} from "react-bootstrap";
import {Formik} from "formik";
import LabelToggle from "../../../core/components/LabelToggle";
import ApplicationService from "../../../core/services/PocketApplicationService";
import NetworkService from "../../../core/services/PocketNetworkService";
import AppAlert from "../../../core/components/AppAlert";
import "./GeneralSettings.scss";

class GeneralSettings extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      deleteModal: false,
      chains: [],
      pocketApplication: {},
      useragents: "",
      origins: "",
      appSecretKey: "",
      secretKey: false,
      appId: "",
      endpoint: "",
      showAlert: false
    };

    this.addWhitelistUserAgents = this.addWhitelistUserAgents.bind(this);
    this.addWhitelistOrigins = this.addWhitelistOrigins.bind(this);
    this.toggleSecretKeyRequired = this.toggleSecretKeyRequired.bind(this);
    this.handleOriginChange = this.handleOriginChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.chainSelect = this.chainSelect.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.copy = this.copy.bind(this);
  }

  copy(property) {
    navigator.clipboard.writeText(this.state[property]);
  }

  async saveChanges() {
    const application = this.state.pocketApplication;

    await ApplicationService.updateGatewaySettings(application);

    this.setState({
      showAlert: true
    });
  }

  async addWhitelistUserAgents() {
    const data = this.state;
    const application = this.state.pocketApplication;
    const agents = data.useragents.split(",").map(function (item) {
      return item.trim();
    });

    application.gatewaySettings.whiltelistUserAgents = agents;

    await ApplicationService.updateGatewaySettings(application);

    this.setState({
      showAlert: true
    });
  }

  async addWhitelistOrigins() {
    const data = this.state;
    const application = this.state.pocketApplication;
    const origins = data.origins.split(",").map(function (item) {
      return item.trim();
    });

    application.gatewaySettings.whiltelistOrigins = origins;

    await ApplicationService.updateGatewaySettings(application);

    this.setState({
      showAlert: true
    });
  }

  async toggleSecretKeyRequired(value) {
    const application = this.state.pocketApplication;

    application.gatewaySettings.secretKeyRequired = value;

    await ApplicationService.updateGatewaySettings(application);
  }

  handleOriginChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({
      origins: data[input.name]
    });
  }

  handleUserChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({
      useragents: data[input.name]
    });
  }

  chainSelect(blockchain) {
    const endpoint = "https://{0}.gateway.pokt.network/v1/{1}".replace("{0}", blockchain).replace("{1}", this.state.appId);

    this.setState({
      endpoint: endpoint
    });
  }

  async componentDidMount() {
    const {id} = this.props.match.params;

    const {
      pocketApplication,
      networkData
    } = await ApplicationService.getClientApplication(id) || {};

    const chains = await NetworkService.getNetworkChains(networkData.chains);
    const endpoint = "https://{0}.gateway.pokt.network/v1/{1}".replace("{0}", chains[0].blockchain).replace("{1}", id);

    this.setState({
      chains,
      pocketApplication,
      secretKey: pocketApplication.gatewaySettings.secretKeyRequired,
      useragents: pocketApplication.gatewaySettings.whiltelistUserAgents.join(),
      origins: pocketApplication.gatewaySettings.whiltelistOrigins.join(),
      appSecretKey: pocketApplication.gatewaySettings.secretKey,
      appId: pocketApplication.id,
      endpoint: endpoint,
    });
  }

  render() {

    const {
      deleteModal,
      chains,
      secretKey,
      useragents,
      origins,
      appSecretKey,
      appId,
      pocketApplication,
      endpoint,
      showAlert
    } = this.state;

    const chainsDropdown = chains.map(function (chain) {
      return <Dropdown.Item key={chain.blockchain} eventKey={chain.blockchain}>{chain.network}</Dropdown.Item>;
    });

    return (
      <div className="general-settings">
        {showAlert && (
          <AppAlert
            className="pb-4 pt-4"
            style={{height: "100px"}}
            variant="primary"
            onClose={() => {
              this.setState({showAlert: false});
            }}
            dismissible
            title={
              <>
                <h4 className="text-uppercase" style={{paddingLeft: "15px"}}>
                  APPLICATION SAVED{" "}
                </h4>
                <p className="ml-2">
                </p>
              </>
            }
          >
            <p ref={(el) => {
              if (el) {
                el.style.setProperty("font-size", "14px", "important");
              }
            }}>
              Your information has been updated.
              </p>
          </AppAlert>
        )}
        <Row>
          <Col>
            <div className="head">
              <img src={"/assets/gateway.png"} alt="gateway" />
              <div className="info">
                <h1 className="name d-flex align-items-center">
                  {pocketApplication.name}&nbsp;<span>- GATEWAY </span>
                </h1>
                <h3 className="owner">{pocketApplication.owner}</h3>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-5 mb-2 page-title">
          <Col sm="11" md="11" lg="11" className="pr-0 pl-0">
            <h2 className="mb-0 pt-2">General settings</h2>
          </Col>
          <Col sm="1" md="1" lg="1" className="btn-sc pr-0">
            <Button
              variant="primary" onClick={this.saveChanges}>
              <span>Save Changes</span>
            </Button>
          </Col>
          <p className="mt-2">
            Set up the app setting to access the provider of blockchain data that allows easy connections to the decentralized network of Pocket Network blockchain nodes. For more information take a look <a rel="noopener noreferrer" href="https://dashboard.docs.pokt.network/docs/gateway-overview" target="_blank"> Pocket Gateway Docs. </a>
          </p>
        </Row>
        <Row className="gateway-data">
          <Col sm="6" md="6" lg="6" className="pl-0">
            <div className="page-title">
              <h3 className="pl-4">Application ID</h3>
              <Alert variant="light">{appId}
                <div className="copy-icon" onClick={() => this.copy("appId")}><img src={"/assets/copy.png"} alt="copy-icon" /></div>
              </Alert>
            </div>
          </Col>
          <Col sm="6" md="6" lg="6" className="pr-0">
            <div className="page-title">
              <h3 className="pl-4">Application Secret Key</h3>
              <Alert variant="light">{appSecretKey}
                <div className="copy-icon" onClick={() => this.copy("appSecretKey")}><img src={"/assets/copy.png"} alt="copy-icon" /></div>
              </Alert>
            </div>
          </Col>
        </Row>
        <Row className="endpoint">
          <Col sm="9" md="9" lg="9" className="pl-0">
            <div className="page-title">
              <h2>Endpoint</h2>
            </div>
          </Col>
          <Col sm="3" md="3" lg="3" className="pr-0">
            <Dropdown className="staked-networks" onSelect={this.chainSelect}>
              <Dropdown.Toggle as={LabelToggle} id="dropdown-basic">
                {"Staked Networks"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {chainsDropdown}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row className="alert-endpoint mb-4">
          <Col sm="12" md="12" lg="12" className="pl-0 pr-0">
            <Alert variant="light">{endpoint}
              <div className="copy-icon" onClick={() => this.copy("endpoint")} ><img src={"/assets/copy.png"} alt="copy-icon" /></div>
            </Alert>
          </Col>
        </Row>
        <Row className="security mt-2">
          <Col className="page-title pl-0">
            <h2>Security</h2>
            <p>
              To maximize security for your application, you may add an additional private secret key or whitelist user agents and origins. For more information take a look Pocket Gateway Docs.
            </p>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col sm="12" md="12" lg="12" className="check pl-0 mt-2">
            <div className="private-secret-check">
              <h2>Private Secret required</h2>
              <Form.Check
                className="secret-checkbox"
                type="checkbox"
                checked={secretKey}
                onChange={() => {
                  this.setState({secretKey: !secretKey});
                  this.toggleSecretKeyRequired(!secretKey);
                }}
                label={
                  <p>Required project secret for all requests</p>
                }
              />
            </div>
          </Col>
        </Row>
        <Row className="whitelist mt-3">
          <Col sm="12" md="12" lg="12" className="pl-0 pr-0">
            <Formik>
              <Form>
                <Form.Group>
                  <Form.Label className="pl-4">Whitelist User agents</Form.Label>
                  <Row>
                    <Col sm="11" md="11" lg="11" className="pl-0">
                      <Form.Control
                        name="agents"
                        value={useragents}
                        placeholder="Whitelist user agents"
                        onChange={this.handleUserChange}
                      />
                    </Col>
                    <Col sm="1" md="1" lg="1" className="pr-0">
                      <Button
                        variant="primary gray" onClick={this.addWhitelistUserAgents}>
                        <span>Add</span>
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Formik>
          </Col>
        </Row>
        <Row className="whitelist mt-3">
          <Col sm="12" md="12" lg="12" className="pl-0 pr-0">
            <Formik>
              <Form>
                <Form.Group>
                  <Form.Label className="pl-4">Whitelist Origins</Form.Label>
                  <Row>
                    <Col sm="11" md="11" lg="11" className="pl-0">
                      <Form.Control
                        name="origins"
                        value={origins}
                        placeholder="Whitelist Origins"
                        onChange={this.handleOriginChange}
                      />
                    </Col>
                    <Col sm="1" md="1" lg="1" className="pr-0">
                      <Button
                        variant="primary gray" onClick={this.addWhitelistOrigins}>
                        <span>Add</span>
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Formik>
          </Col>
        </Row>
        <Row className="remove-app" style={{display: "none"}}>
          <Col sm="12" md="12" lg="12" className="pl-0">
            <span className="option">
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
          className="delete-app-settings"
          show={deleteModal}
          onHide={() => this.setState({deleteModal: false})}
          animation={false}
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Are you sure you want to delete this APP fom the Pocket Gateway?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="mb-4">Deleting this will result in any services using this application will no longer be able to access blockchain data.</p>
            <Formik>
              <Form>
                <Form.Group>
                  <Form.Label className="pl-4">TYPE DELETE TO CONFIRM</Form.Label>
                  <Form.Control
                    name="delete"
                    placeholder="Delete"
                  />
                </Form.Group>
              </Form>
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button className="light-button" onClick={() => this.setState({deleteModal: false})}>
              <span>Cancel</span>
            </Button>
            <Button>
              <span>Delete</span>
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default GeneralSettings;
