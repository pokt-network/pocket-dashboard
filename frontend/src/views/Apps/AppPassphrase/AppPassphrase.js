import React, {Component} from "react";
import "./AppPassphrase.scss";
import {Button, Col, Form, Row} from "react-bootstrap";
import AppAlert from "../../../core/components/AppAlert";
import AppTable from "../../../core/components/AppTable";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {TABLE_COLUMNS, VALIDATION_MESSAGES} from "../../../_constants";
import {Formik} from "formik";
import * as yup from "yup";
import {createAndDownloadJSONFile, validateYup, scrollToId} from "../../../_helpers";
import PocketApplicationService from "../../../core/services/PocketApplicationService";
import ApplicationService from "../../../core/services/PocketApplicationService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {Redirect} from "react-router-dom";
import Segment from "../../../core/components/Segment/Segment";

class AppPassphrase extends Component {

  constructor(props, context) {
    super(props, context);

    this.changeInputType = this.changeInputType.bind(this);
    this.handlePassphrase = this.handlePassphrase.bind(this);
    this.createApplicationAccount = this.createApplicationAccount.bind(this);
    this.downloadKeyFile = this.downloadKeyFile.bind(this);

    this.iconUrl = {
      open: "/assets/open_eye.svg",
      close: "/assets/closed_eye.svg",
    };

    this.schema = yup.object().shape({
      passPhrase: yup
        .string()
        .required(VALIDATION_MESSAGES.REQUIRED)
        .matches(
          // eslint-disable-next-line no-useless-escape
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{15,})/, "The password does not meet the requirements"
        ),
    });

    this.state = {
      created: false,
      fileDownloaded: false,
      inputType: "password",
      validPassphrase: false,
      showPassphraseIconURL: this.iconUrl.open,
      privateKey: "",
      address: "",
      chains: [],
      error: {show: false, message: ""},
      data: {
        passPhrase: "",
      },
      redirectPath: "",
      redirectParams: {}
    };
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

  async handlePassphrase(values) {
    const valid = await validateYup(values, this.schema);

    if (valid === undefined) {
      this.setState({
        passPhrase: values.passPhrase,
        validPassphrase: true,
      });
    } else {
      this.setState({validPassphrase: false});
    }
  }

  async createApplicationAccount() {
    const applicationInfo = PocketApplicationService.getApplicationInfo();
    const {passPhrase} = this.state;

    const applicationBaseLink = `${window.location.origin}${_getDashboardPath(DASHBOARD_PATHS.appDetail)}`;

    const {success, data} = await ApplicationService
      .createApplicationAccount(applicationInfo.id, passPhrase, applicationBaseLink);

    if (success) {
      const {privateApplicationData} = data;
      const {address, privateKey} = privateApplicationData;

      PocketApplicationService.removeAppInfoFromCache();
      PocketApplicationService.saveAppInfoInCache({
        applicationID: applicationInfo.id,
        passphrase: passPhrase,
        address,
        privateKey
      });

      this.setState({
        created: true,
        address,
        privateKey
      });
    } else {
      this.setState({error: {show: true, message: data.message}});
      scrollToId("alert");
    }
  }

  downloadKeyFile() {
    const {privateKey, passPhrase} = this.state;
    const data = {"private_key": privateKey, "passphrase": passPhrase};

    createAndDownloadJSONFile("MyPocketApplication", data);

    this.setState({
      fileDownloaded: true,
      redirectPath: _getDashboardPath(DASHBOARD_PATHS.applicationChangeList),
    });
  }

  render() {
    const {
      created,
      fileDownloaded,
      inputType,
      showPassphraseIconURL,
      validPassphrase,
      privateKey,
      address,
      redirectPath,
      redirectParams,
      error,
    } = this.state;

    if (fileDownloaded) {
      return (
        <Redirect
          to={{
            pathname: redirectPath,
            state: redirectParams,
          }}
        />
      );
    }

    const generalInfo = [
      {title: "0 POKT", subtitle: "Staked tokens"},
      {title: "0 POKT", subtitle: "Balance"},
      {title: "_ _", subtitle: "Stake status"},
      {title: "_ _", subtitle: "Max Relay Per Day"},
    ];

    return (
      <div id="app-passphrase">
        <Row>
          <Col className="page-title">
            {error.show && (
              <AppAlert
                variant="danger"
                title={error.message}
                dismissible
                onClose={() => this.setState({error: {show: false}})}
              />
            )}
            <h1>Create App</h1>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <h2>Protect your private key with a passphrase</h2>
            <p>
              Write down a passphrase to protect your key file. This should have
              minimum 15 alphanumeric symbols, one capital letter, one
              lowercase, one special character and one number.
            </p>
            <Formik
              validationSchema={this.schema}
              onSubmit={(data) => {
                this.setState({data});
              }}
              initialValues={this.state.data}
              values={this.state.data}
              validateOnChange={true}
              validateOnBlur={false}
              validate={this.handlePassphrase}
            >
              {({handleSubmit, handleChange, values, errors}) => (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  className="create-passphrase-form"
                >
                  <Form.Row>
                    <Col className="show-passphrase">
                      <Form.Group>
                        <Form.Control
                          placeholder="*****************"
                          value={values.passPhrase}
                          type={inputType}
                          name="passPhrase"
                          onChange={(data) => {
                            handleChange(data);
                          }}
                          isInvalid={!!errors.passPhrase}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.passPhrase}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <img
                        onClick={this.changeInputType}
                        src={showPassphraseIconURL}
                        alt=""
                      />
                    </Col>
                    <Col>
                      <Button
                        disabled={!validPassphrase}
                        className={`pl-4 pr-4 pt-2 pb-2 ${created ? "download-key-file-button" : null}`}
                        variant="primary"
                        type="submit"
                        onClick={
                          !created
                            ? () => this.createApplicationAccount()
                            : () => this.downloadKeyFile()
                        }>
                        <span>
                          {created ? <img src={"/assets/download.svg"} alt="download-key-file"
                                          className="download-key-file-icon"/> : null}
                          {created ? "Download key file" : "Create"}
                        </span>
                      </Button>
                    </Col>
                  </Form.Row>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col sm="6" md="6" lg="6">
            <h3>Private key</h3>
            <Form.Control readOnly value={privateKey}/>
          </Col>
          <Col sm="6" md="6" lg="6">
            <h3>Address</h3>
            <Form.Control readOnly value={address}/>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <AppAlert
              className="pb-4 pt-4"
              variant="warning"
              title={
                <>
                  <h4 className="text-uppercase">
                    Don&#39;t forget to save your passphrase!{" "}
                  </h4>
                  <p className="ml-1">
                    Make a backup, store it and save preferably offline.
                  </p>
                </>
              }
            >
              <p>
                The key file by itself is useless without the passphrase and
                you&#39;ll need it to import or set up your application.
              </p>
            </AppAlert>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <h1>General information</h1>
          </Col>
        </Row>
        <br/>
        <Row className="stats">
          {generalInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard title={card.title} subtitle={card.subtitle}/>
            </Col>
          ))}
        </Row>
        <br/>
        <Row className="mb-5 app-networks">
          <Col>
            <Segment label="Networks">
              <AppTable
                scroll
                toggler={[].length > 0}
                keyField="hash"
                data={[]}
                columns={TABLE_COLUMNS.NETWORK_CHAINS}
                bordered={false}
              />
            </Segment>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AppPassphrase;
