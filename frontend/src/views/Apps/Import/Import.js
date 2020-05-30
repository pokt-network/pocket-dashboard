import React, {Component} from "react";
import {Button, Col, Form, Row, Alert} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {TABLE_COLUMNS, ITEM_TYPES} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {Link} from "react-router-dom";
import "./Import.scss";
import AccountService from "../../../core/services/PocketAccountService";
import ApplicationService from "../../../core/services/PocketApplicationService";
import AppTable from "../../../core/components/AppTable";
import NodeService from "../../../core/services/PocketNodeService";

class Import extends Component {
  constructor(props, context) {
    super(props, context);

    this.importAccount = this.importAccount.bind(this);
    this.changeInputType = this.changeInputType.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.iconUrl = {
      open: "/assets/open_eye.svg",
      close: "/assets/closed_eye.svg",
    };

    this.state = {
      type: "",
      created: false,
      error: {show: false, message: ""},
      hasPrivateKey: false,
      inputType: "password",
      validPassphrase: false,
      showPassphraseIconURL: this.iconUrl.open,
      address: "",
      uploadedPrivateKey: "",
      chains: [],
      data: {
        passphrase: "",
        privateKey: "",
      },
      imported: false,
    };
  }

  componentDidMount() {
    const path = window.location.pathname;

    if (path === _getDashboardPath(DASHBOARD_PATHS.importApp)) {
      this.setState({type: ITEM_TYPES.APPLICATION});
    } else if (path === _getDashboardPath(DASHBOARD_PATHS.importNode)) {
      this.setState({type: ITEM_TYPES.NODE});
    }
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  changeInputType() {
    const {inputType} = this.state;

    if (inputType === "text") {
      this.setState({
        inputType: "password",
        showPassphraseIconURL: this.iconUrl.open,
      });
    } else {
      this.setState({
        inputType: "text",
        showPassphraseIconURL: this.iconUrl.close,
      });
    }
  }

  readUploadedFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();

    reader.onload = (e) => {
      const {result} = e.target;
      const {data} = this.state;

      const privateKey = result.trim();

      this.setState({
        hasPrivateKey: true,
        uploadedPrivateKey: privateKey,
        data: {...data, privateKey: privateKey},
      });
    };
    reader.readAsText(e.target.files[0], "utf8");
  };

  async importAccount(e) {
    e.preventDefault();

    const {type} = this.state;
    const {privateKey, passphrase} = this.state.data;

    const {success, data} = await AccountService.importAccount(
      privateKey, passphrase
    );

    if (success) {
      if (type === ITEM_TYPES.APPLICATION) {
        ApplicationService.saveAppInfoInCache({
          imported: true,
          privateKey,
          passphrase,
          address: data.address,
        });
      } else {
        NodeService.saveNodeInfoInCache({
          privateKey,
          passphrase,
          address: data.address,
        });
      }
      this.setState({imported: true, address: data.address});
    } else {
      this.setState({error: {show: true, message: data.message}});
    }
  }

  render() {
    const {
      inputType,
      showPassphraseIconURL,
      address,
      uploadedPrivateKey,
      hasPrivateKey,
      error,
      imported,
      type,
    } = this.state;

    const {passphrase, privateKey} = this.state.data;

    const generalInfo = [
      {title: "0 POKT", subtitle: "Staked tokens"},
      {title: "0 POKT", subtitle: "Balance"},
      {title: "_ _", subtitle: "Stake status"},
      {title: "_ _", subtitle: "Max Relays per Day"},
    ];

    return (
      <div id="app-passphrase" className="import">
        <Row>
          <Col className="page-title">
            <h1>Import {type === ITEM_TYPES.APPLICATION ? "App" : "Node"}</h1>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <p>
              Import to the dashboard a pocket account previously created as a
              {type === ITEM_TYPES.APPLICATION ? "n " : " "}
              {type} in the network. If your account is not a
              {type === ITEM_TYPES.APPLICATION ? "n " : " "} {type} go to{" "}
              <Link
                className="font-weight-light"
                to={_getDashboardPath(
                  type === ITEM_TYPES.APPLICATION
                    ? DASHBOARD_PATHS.createAppInfo
                    : DASHBOARD_PATHS.createNodeForm
                )}
              >
                Create.
              </Link>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <Form className="create-passphrase-form ">
              <Form.Row>
                <Col className="show-passphrase flex-column">
                  <h2>Key file</h2>
                  <Form.Group className="d-flex">
                    <Form.Control
                      className="mr-3"
                      readOnly
                      placeholder="Upload your key file"
                      value={uploadedPrivateKey}
                    />
                    <div className="file">
                      <label
                        htmlFor="upload-key"
                        className="upload-key btn btn-primary"
                      >
                        <span className="pl-4 pr-4">Upload key file</span>
                      </label>
                      <input
                        style={{display: "none"}}
                        id="upload-key"
                        type="file"
                        onChange={(e) => this.readUploadedFile(e)}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Form.Row>
            </Form>
          </Col>
          <Col className="page-title">
            <Form className="create-passphrase-form ">
              <Form.Row>
                <Col className="show-passphrase flex-column">
                  {!hasPrivateKey ? (
                    <>
                      <h2>Private key</h2>
                      <Form.Group className="d-flex">
                        <Form.Control
                          placeholder="*****************"
                          value={privateKey}
                          required
                          onChange={this.handleChange}
                          type={inputType}
                          name="privateKey"
                        />
                        <img
                          className="eye-icon"
                          onClick={this.changeInputType}
                          src={showPassphraseIconURL}
                          alt=""
                        />
                        <Button
                          className="pl-4 pr-4 pt-2 pb-2"
                          variant="dark"
                          type="submit"
                          onClick={() => {
                            this.setState({hasPrivateKey: true});
                          }}
                        >
                          <span>Import</span>
                        </Button>
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <h2>Passphrase</h2>
                      <Form.Group className="d-flex">
                        <Form.Control
                          placeholder="*****************"
                          value={passphrase}
                          required
                          onChange={this.handleChange}
                          type={inputType}
                          name="passphrase"
                          className={error.show ? "is-invalid" : ""}
                        />
                        <Form.Control.Feedback
                          className="invalid-acount"
                          type="invalid"
                        >
                          {error.show ? error.message : ""}
                        </Form.Control.Feedback>
                        <img
                          className="eye-icon"
                          onClick={this.changeInputType}
                          src={showPassphraseIconURL}
                          alt=""
                        />
                        <Button
                          variant="dark"
                          type="submit"
                          onClick={
                            !imported
                              ? this.importAccount
                              : () => {
                                  // eslint-disable-next-line react/prop-types
                                  this.props.history.push({
                                    pathname: _getDashboardPath(
                                      type === ITEM_TYPES.APPLICATION
                                        ? DASHBOARD_PATHS.createAppInfo
                                        : DASHBOARD_PATHS.createNodeForm
                                    ),
                                    state: {imported: true},
                                  });
                                }
                          }
                        >
                          <span>{!imported ? "Create" : "Continue"}</span>
                        </Button>
                      </Form.Group>
                    </>
                  )}
                </Col>
              </Form.Row>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col className="mt-4 page-title">
            <h1>General information</h1>
          </Col>
        </Row>
        <br />
        <Row className="stats">
          {generalInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard title={card.title} subtitle={card.subtitle} />
            </Col>
          ))}
        </Row>
        <Row>
          <Col className="mt-5 title-page">
            <h3>Address</h3>
            <Alert variant="light">
              <span className="address">{address}</span>
            </Alert>
          </Col>
        </Row>
        <Row className="mt-2 app-networks">
          <Col className="title-page">
            <h3>Networks</h3>
            <AppTable
              scroll
              keyField="hash"
              data={[]}
              columns={TABLE_COLUMNS.NETWORK_CHAINS}
              bordered={false}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Import;
