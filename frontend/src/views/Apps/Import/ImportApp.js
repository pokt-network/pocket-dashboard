import React, {Component} from "react";
import {Button, Col, Form, Row, Alert} from "react-bootstrap";
import AppAlert from "../../../core/components/AppAlert";
import BootstrapTable from "react-bootstrap-table-next";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {TABLE_COLUMNS, VALIDATION_MESSAGES} from "../../../_constants";
import {Formik} from "formik";
import * as yup from "yup";
import {createAndDownloadJSONFile, validateYup} from "../../../_helpers";
import PocketApplicationService from "../../../core/services/PocketApplicationService";
import ApplicationService from "../../../core/services/PocketApplicationService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {Redirect, Link} from "react-router-dom";
import Segment from "../../../core/components/Segment/Segment";
import "./ImportApp.scss";

class Import extends Component {
  constructor(props, context) {
    super(props, context);

    this.changeInputType = this.changeInputType.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.iconUrl = {
      open: "/assets/open_eye.svg",
      close: "/assets/closed_eye.svg",
    };

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
        privateKey: "",
      },
      redirectPath: "",
      redirectParams: {},
    };
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

  render() {
    const {
      created,
      fileDownloaded,
      inputType,
      showPassphraseIconURL,
      validPassphrase,
      address,
      redirectPath,
      redirectParams,
    } = this.state;

    const {passPhrase, privateKey} = this.state.data;

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
      {title: "_ _", subtitle: "Stake status"},
      {title: "_ _", subtitle: "Max Relays"},
    ];

    return (
      <div id="app-passphrase" className="import">
        <Row>
          <Col className="page-title">
            <h1>Import App</h1>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <p>
              Import to the dashboard a pocket account previously created as an
              application in the network. If your account is not an app go to{" "}
              <Link to={_getDashboardPath(DASHBOARD_PATHS.createAppInfo)}>
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
                      placeholder="Upload your key file"
                      value={passPhrase}
                      onChange={this.handleChange}
                      name="passPhrase"
                    />
                    <Button className="upload-btn" variant="primary">
                      Upload key file
                    </Button>
                  </Form.Group>
                </Col>
              </Form.Row>
            </Form>
          </Col>
          <Col className="page-title">
            <Form className="create-passphrase-form ">
              <Form.Row>
                <Col className="show-passphrase flex-column">
                  <h2>Private key</h2>
                  <Form.Group className="d-flex">
                    <Form.Control
                      placeholder="*****************"
                      value={passPhrase}
                      onChange={this.handleChange}
                      type={inputType}
                      name="passPhrase"
                    />
                    <Form.Control.Feedback type="invalid">
                      {/* {errors.passPhrase} */}
                    </Form.Control.Feedback>
                    <img
                      onClick={this.changeInputType}
                      src={showPassphraseIconURL}
                      alt=""
                    />
                    <Button
                      disabled={!validPassphrase}
                      className="pl-4 pr-4 pt-2 pb-2"
                      variant="dark"
                      type="submit"
                      onClick={
                        !created
                          ? () => this.createApplicationAccount()
                          : () => this.downloadKeyFile()
                      }
                    >
                      <span>
                        {!created ? (
                          "Import"
                        ) : (
                          <span>
                            <img src="/assets/" alt="download-key-file" />{" "}
                            Create
                          </span>
                        )}
                      </span>
                    </Button>
                  </Form.Group>
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
            <BootstrapTable
              classes="table app-table app-table-empty table-striped"
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
