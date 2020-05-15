import React, {Component} from "react";
import "./AppPassphrase.scss";
import {Button, Col, Form, Row} from "react-bootstrap";
import AppAlert from "../../../core/components/AppAlert";
import BootstrapTable from "react-bootstrap-table-next";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {TABLE_COLUMNS, VALIDATION_MESSAGES} from "../../../_constants";
import {Formik} from "formik";
import * as yup from "yup";
import {createAndDownloadFile, validateYup} from "../../../_helpers";
import PocketApplicationService from "../../../core/services/PocketApplicationService";
import ApplicationService from "../../../core/services/PocketApplicationService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {Redirect} from "react-router-dom";

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
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{15,})/, "The password does not meet the requirements"),
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

    const {success, data} = await ApplicationService.createApplicationAccount(applicationInfo.id, passPhrase, applicationBaseLink);

    if (success) {
      const {privateApplicationData} = data;
      const {address, privateKey} = privateApplicationData;

      PocketApplicationService.removeAppInfoFromCache();
      PocketApplicationService.saveAppInfoInCache({
        applicationID: applicationInfo.id,
        address,
        privateKey
      });

      this.setState({
        created: true,
        address,
        privateKey
      });
    } else {
      // TODO: Show proper error message on front-end.
      console.log(data);
    }
  }

  downloadKeyFile() {
    const {privateKey} = this.state;

    createAndDownloadFile(privateKey);

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
      {title: "0 POKT", subtitle: "Stake tokens"},
      {title: "0 POKT", subtitle: "Balance"},
      {title: "--", subtitle: "Stake status"},
      {title: "--", subtitle: "Max Relays"},
    ];

    return (
      <div id="passphrase">
        <Row>
          <Col sm="12" md="12" lg="12">
            <h1>Create App</h1>

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
              onChange={(a) => {
                console.log(a);
              }}
              validateOnChange={true}
              validateOnBlur={false}
              validate={this.handlePassphrase}
            >
              {({handleSubmit, handleChange, values, errors}) => (
                <Form noValidate onSubmit={handleSubmit}>
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
                        className="pl-4 pr-4 pt-2 pb-2"
                        variant="primary"
                        type="submit"
                        onClick={
                          !created
                            ? () => this.createApplicationAccount()
                            : () => this.downloadKeyFile()
                        }
                      >
                        {!created ? "Create" : "Download key file "}
                      </Button>
                    </Col>
                  </Form.Row>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Form>
              <Row>
                <Col>
                  <h3>Private key</h3>
                  <Form.Control readOnly value={privateKey}/>
                </Col>
                <Col>
                  <h3>Address</h3>
                  <Form.Control readOnly value={address}/>
                </Col>
              </Row>
            </Form>
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
        <h2>General information</h2>
        <Row className="stats">
          {generalInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard title={card.title} subtitle={card.subtitle}/>
            </Col>
          ))}
        </Row>
        <Row className="mt-4"></Row>
        <Row className="mb-5">
          <Col>
            <h3 className="sub mb-3">Networks</h3>
            <BootstrapTable
              classes="table app-table table-striped"
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

export default AppPassphrase;
