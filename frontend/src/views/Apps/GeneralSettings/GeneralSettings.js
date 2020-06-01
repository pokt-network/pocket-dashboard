import React, {Component} from "react";
import {Alert, Form, Col, Row, Modal, Button, Dropdown} from "react-bootstrap";
import {Formik} from "formik";
import LabelToggle from "../../../core/components/LabelToggle";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {STYLING} from "../../../_constants";
import "./GeneralSettings.scss";

class GeneralSettings extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      deleteModal: false,
    };
  }

  render() {

    const {
      deleteModal,
    } = this.state;

    return (
      <div className="general-settings">
        <Row>
          <Col>
            <div className="head">
              <img src={"/assets/gateway.png"} alt="gateway"/>
              <div className="info">
                <h1 className="name d-flex align-items-center">
                  EXAMPLE NAME APP&nbsp;<span>- GATEWAY </span>
                </h1>
                <h3 className="owner">COMPANY NAME</h3>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-5 mb-2 page-title">
          <Col sm="8" md="8" lg="8" className="pl-0">
            <h2 className="mb-0 pt-2">General settings</h2>
          </Col>
          <Col sm="4" md="4" lg="4" className="btn-sc pr-0">
            <Button
              variant="primary">
                <span>Save Changes</span>
            </Button>
          </Col>
          <p className="mt-2">
            Set up the app setting to access the provider of blockchain data that allows easy connections to the decentralized network of Pocket Network blockchain nodes. For more information take a look <a href="http://example.com"> Pocket Gateway Docs. </a>
          </p>
        </Row>
        <Row className="gateway-data">
          <Col sm="6" md="6" lg="6" className="pl-0">
            <div className="page-title">
              <h3 className="pl-4">Gateway</h3>
              <Alert variant="light">a969144c864bd87a92e9a969144c864bd87a92e9 
                <div className="copy-icon"><img src={"/assets/copy.png"} alt="copy-icon"/></div> 
              </Alert>
            </div>
          </Col>
          <Col sm="6" md="6" lg="6" className="pr-0">
            <div className="page-title">
              <h3 className="pl-4">Application Secret Key</h3>
              <Alert variant="light">a969144c864bd87a92e9a969144c864bd87a92e9
                <div className="copy-icon"><img src={"/assets/copy.png"} alt="copy-icon"/></div> 
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
            <Dropdown className="staked-networks">
              <Dropdown.Toggle as={LabelToggle} id="dropdown-basic">
                {"Staked Networks"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>
                  Pocket Network
                </Dropdown.Item>
                <Dropdown.Item>
                  Aion
                </Dropdown.Item>
                <Dropdown.Item>
                  Ethereum
                </Dropdown.Item>
                <FontAwesomeIcon
                  className="icon"
                  icon={faAngleDown}
                  color={STYLING.primaryColor}
                />
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row className="alert-endpoint mb-4">
          <Col sm="12" md="12" lg="12" className="pl-0 pr-0">
            <Alert variant="light">https://mainnet.pocket.ifsiodhfsoifhiefwef/efwieoh8r13nno9e90-sdfsdf/008889f008309/e9a969144c864bd87a94
              <div className="copy-icon"><img src={"/assets/copy.png"} alt="copy-icon"/></div> 
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
                        name="whitelist"
                        placeholder="Whitelist user agents"
                      />
                    </Col>
                    <Col sm="1" md="1" lg="1" className="pr-0">
                      <Button
                        variant="primary gray">
                          <span>Add</span>
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
                <div className="mt-4">
                  <Alert variant="light">https://mainnet.pocket.ifsiodhfsoifhiefwef/efwieoh8r13nno9e90-sdfsdf/008889f008309/e9a969144c864bd87a94
                    <div className="exit-icon"><img src={"/assets/exit.png"} alt="exit-icon"/></div> 
                  </Alert>
                </div>
                <div className="mt-4">
                  <Alert variant="light">https://mainnet.pocket.ifsiodhfsoifhiefwef/efwieoh8r13nno9e90-sdfsdf/008889f008309/e9a969144c864bd87a94
                    <div className="exit-icon"><img src={"/assets/exit.png"} alt="exit-icon"/></div> 
                  </Alert>
                </div>
              </Form>
            </Formik>
          </Col>
        </Row>
        <Row className="whitelist mt-3">
          <Col sm="12" md="12" lg="12" className="pl-0">
            <Formik>
              <Form>
                <Form.Group>
                  <Form.Label className="pl-4">Whitelist Origins</Form.Label>
                  <Row>
                    <Col sm="11" md="11" lg="11" className="pl-0">
                      <Form.Control
                        name="whitelist"
                        placeholder="Whitelist Origins"
                      />
                    </Col>
                    <Col sm="1" md="1" lg="1" className="pr-0">
                      <Button
                        variant="primary gray">
                          <span>Add</span>
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
                <Alert variant="light">https://mainnet.pocket.ifsiodhfsoifhiefwef/efwieoh8r13nno9e90-sdfsdf/008889f008309/e9a969144c864bd87a94
                  <div className="exit-icon"><img src={"/assets/exit.png"} alt="exit-icon"/></div> 
                </Alert>
              </Form>
            </Formik>
          </Col>
        </Row>
        <Row className="remove-app">
          <Col sm="12" md="12" lg="12" className="pl-0">
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
