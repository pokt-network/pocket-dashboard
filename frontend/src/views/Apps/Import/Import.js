import React, {Component} from "react";
import {Alert, Button, Col, Form, Row} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {ITEM_TYPES, TABLE_COLUMNS} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {Link} from "react-router-dom";
import "./Import.scss";
import AccountService from "../../../core/services/PocketAccountService";
import ApplicationService from "../../../core/services/PocketApplicationService";
import AppTable from "../../../core/components/AppTable";
import NodeService from "../../../core/services/PocketNodeService";
import PocketClientService from "../../../core/services/PocketClientService";
import UserService from "../../../core/services/PocketUserService";
import {Configurations} from "../../../_configuration";
import {getStakeStatus, formatNumbers, upoktToPOKT} from "../../../_helpers";
import PocketNetworkService from "../../../core/services/PocketNetworkService";
import LoadingButton from "../../../core/components/LoadingButton";
import AppAlert from "../../../core/components/AppAlert";

class Import extends Component {
  constructor(props, context) {
    super(props, context);

    this.importAccount = this.importAccount.bind(this);
    this.changeInputType = this.changeInputType.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.continue = this.continue.bind(this);

    this.iconUrl = {
      open: "/assets/open_eye.svg",
      close: "/assets/closed_eye.svg",
    };

    this.state = {
      importing: false,
      type: "",
      created: false,
      error: {show: false, message: "", type: "danger"},
      errorMessage: {show: false, message: "", type: "danger"},
      hasPPK: false,
      inputType: "password",
      validPassphrase: false,
      showPassphraseIconURL: this.iconUrl.open,
      address: "",
      chains: [],
      ppkFileName: "Upload your key file",
      data: {
        passphrase: "",
        privateKey: "",
        ppkData: "",
      },

      accountData: {
        tokens: 0,
        balance: 0,
        status: Configurations.stakeDefaultStatus,
        // Could be either validator power / max relays per day
        amount: 0,
      },
      imported: false,
    };
  }

  componentDidMount() {
    const path = window.location.pathname;

    if (path === _getDashboardPath(DASHBOARD_PATHS.importApp)) {
      this.setState({type: ITEM_TYPES.APPLICATION});
      UserService.saveUserAction("Import App");
    } else if (path === _getDashboardPath(DASHBOARD_PATHS.importNode)) {
      this.setState({type: ITEM_TYPES.NODE});
      UserService.saveUserAction("Import Node");
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
    const ppkFileName = e.target.files[0].name;

    reader.onload = (e) => {
      const {result} = e.target;
      const {data} = this.state;
      const ppkData = JSON.parse(result.trim());

      this.setState({
        ppkFileName,
        hasPPK: true,
        data: {...data, privateKey: "", ppkData},
      });
    };
    reader.readAsText(e.target.files[0], "utf8");
  };

  async continue(e) {
    e.preventDefault();

    const {
      type,
      created,
    } = this.state;

    if(!created) {
      // eslint-disable-next-line react/prop-types
      this.props.history.push({
        pathname: _getDashboardPath(
          type === ITEM_TYPES.APPLICATION
            ? DASHBOARD_PATHS.createAppInfo
            : DASHBOARD_PATHS.createNodeForm
        ),
        state: {imported: true},
      });
    } else {
      this.setState({
        importing: false,
        error: {show: true, message: "App already exists"},
      });
    }
  }

  async importAccount(e) {
    e.preventDefault();

    this.setState({importing: true, error: {show: false, message: ""}});

    const {type} = this.state;
    const {privateKey, passphrase, ppkData} = this.state.data;
    let ppk;

    if (!passphrase) {
      this.setState({
        importing: false,
        error: {show: true, message: "Your passphrase cannot be empty"},
      });
      return;
    }

    if (!ppkData) {
      ppk = JSON.parse(
        await PocketClientService.createPPKFromPrivateKey(
          privateKey, passphrase
        )
      );
    } else {
      ppk = ppkData;
    }

    const {success, data} = await AccountService.importAccount(
      ppk, passphrase);

    if (success) {
      await PocketClientService.saveAccount(
        JSON.stringify(ppk), passphrase);
      let chains;
      const {balance} = await AccountService.getPoktBalance(data.address);

      if (type === ITEM_TYPES.APPLICATION) {
        ApplicationService.saveAppInfoInCache({
          imported: true,
          passphrase,
          address: data.address,
          ppk,
        });

        // Retrieve the application information if available
        const application = await ApplicationService.getNetworkApplication(data.address);
        const appInDB = await ApplicationService.getApplication(data.address);

        this.setState({
          created: appInDB !== undefined && appInDB !== null
        });

        console.log(application);
        if (application.error === undefined) {
          // Add the chains value
          chains = application.chains;
          // Update the state
          this.setState({
            accountData: {
              tokens: application.staked_tokens,
              balance: balance,
              status: getStakeStatus(application.status.toString()),
              amount: application.max_relays
            },
            // App Staked chains
            chains: application.chains
          });
        } else {
          const message = application.message.split(":")[0];
          let errorType = message === "Failed to retrieve the app infromation" ? "warning" : "danger"
          this.setState({
            importing: false,
            errorMessage: {show: true, message: message, type: errorType},
            accountData: {
              tokens: 0,
              balance: balance,
              status: getStakeStatus("0"),
              amount: 0
            }
          });
        }
      } else {
        NodeService.saveNodeInfoInCache({
          passphrase,
          address: data.address,
          ppk,
        });
        const node = await NodeService.getNetworkNode(data.address);
        const nodeInDB = await NodeService.getNode(data.address);

        this.setState({
          created: nodeInDB.pocketNode !== undefined
        });

        if (node.error === undefined) {
          // Add the chains value
          chains = node.chains;
          // Update the state

          this.setState({
            accountData: {
              tokens: node.tokens,
              balance: balance,
              status: getStakeStatus(node.status.toString()),
              amount: node.max_relays
            },
            // Node Staked chains
            chains: node.chains
          });
        } else {
          this.setState({
            importing: false,
            errorMessage: { show: true, message: node.message.split(":")[0]},
            accountData: {
              tokens: 0,
              balance: balance,
              status: getStakeStatus("0"),
              amount: 0
            }
          });
        }
      }
      let accountChains = [];

      if (chains !== undefined && chains.length > 0) {
        accountChains = await PocketNetworkService.getNetworkChains(chains);
      }

      this.setState({
        chains: accountChains,
        error: {show: false},
        imported: true,
        importing: false,
        address: data.address,
      });
    } else {
      this.setState({
        importing: false,
        error: {show: true, message: data.message.replace("TypeError: ", "")},
      });
    }
  }

  render() {
    const {
      importing,
      inputType,
      showPassphraseIconURL,
      address,
      hasPPK,
      error,
      errorMessage,
      imported,
      type,
      ppkFileName,
      accountData,
      chains,
    } = this.state;

    const {passphrase, privateKey} = this.state.data;

    const generalInfo = [
      {title: upoktToPOKT(accountData.tokens).toFixed(2), subtitle: "Staked tokens"},
      {
        title: `${formatNumbers(accountData.balance / 1000000)} POKT`,
        subtitle: "Balance",
      },
      {title: accountData.status, subtitle: "Stake status"},
      {
        title:
          type === ITEM_TYPES.APPLICATION
          ? (formatNumbers(accountData.amount) * Configurations.pocket_network.max_sessions)
          : formatNumbers(accountData.amount),
        subtitle:
          type === ITEM_TYPES.APPLICATION
            ? "Max Relays per Day"
            : "Validator Power",
      },
    ];

    return (
      <div id="app-passphrase" className="import">
        <Row>
          {errorMessage.show && (
            <AppAlert
              variant={errorMessage.type}
              title={errorMessage.message}
              onClose={() => this.setState({errorMessage: {show: false}})}
              dismissible />
          )}
          <Col className="page-title">
            <h1>Import {type === ITEM_TYPES.APPLICATION ? "App" : "Node"}</h1>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <p>
              Use the dashboard to import a previously created Pocket {type} {" "}
              in the network. If your account is not a
              {type === ITEM_TYPES.APPLICATION ? "n " : " "} {type} go to{" "}
              <Link
                className="font-weight-light"
                to={_getDashboardPath(
                  type === ITEM_TYPES.APPLICATION
                    ? DASHBOARD_PATHS.createAppInfo
                    : DASHBOARD_PATHS.createNodeForm
                )}
              >
                Create {type === ITEM_TYPES.APPLICATION ? "App" : "Node"}
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
                      placeholder={ppkFileName}
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
                  {!hasPPK ? (
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
                            this.setState({hasPPK: true});
                          }}
                        >
                          <span>Continue</span>
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
                            className="invalid-account"
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
                          <LoadingButton
                            loading={importing}
                            disabled={errorMessage.show && errorMessage.type === "danger"}
                            buttonProps={{
                              variant: "dark",
                              type: "submit",
                              onClick: !imported
                                ? this.importAccount
                                : this.continue,
                            }}
                          >
                            <span>{!imported ? "Import" : "Continue"}</span>
                          </LoadingButton>
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
              toggle={chains.length > 0}
              keyField="hash"
              data={chains}
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
