import React, { Component } from "react";
import "./Passphrase.scss";
import { Button, Col, Form, Row } from "react-bootstrap";
import AppAlert from "../../../core/components/AppAlert";
import AppTable from "../../../core/components/AppTable";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import { PASSPHRASE_REGEX, TABLE_COLUMNS, VALIDATION_MESSAGES } from "../../../_constants";
import { Formik } from "formik";
import * as yup from "yup";
import { createAndDownloadJSONFile, validateYup } from "../../../_helpers";
import Segment from "../../../core/components/Segment/Segment";
import LoadingButton from "../../../core/components/LoadingButton";
import cls from "classnames";
import isEmpty from "lodash/isEmpty";
import { Configurations } from "../../../_configuration";

class Passphrase extends Component {
  constructor(props, context) {
    super(props, context);

    this.changePassphraseInputType = this.changePassphraseInputType.bind(this);
    this.changePrivateKeyInputType = this.changePrivateKeyInputType.bind(this);
    this.handlePassphrase = this.handlePassphrase.bind(this);
    this.createAccount = this.createAccount.bind(this);
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
          PASSPHRASE_REGEX, "The passphrase does not meet the requirements"
        ),
    });

    this.state = {
      type: "",
      fileName: "",
      created: false,
      fileDownloaded: false,
      inputPassphraseType: "password",
      inputPrivateKeyType: "password",
      validPassphrase: false,
      showPassphraseIconURL: this.iconUrl.close,
      showPrivateKeyIconURL: this.iconUrl.close,
      privateKey: "",
      address: "",
      chains: [],
      error: { show: false, message: "" },
      data: {
        passPhrase: "",
      },
      redirectPath: "",
      redirectParams: {},
      loading: false,
    };
  }

  changePassphraseInputType() {
    const { inputPassphraseType } = this.state;

    if (inputPassphraseType === "text") {
      this.setState({
        inputPassphraseType: "password",
        showPassphraseIconURL: this.iconUrl.open,
      });
    } else {
      this.setState({
        inputPassphraseType: "text",
        showPassphraseIconURL: this.iconUrl.close,
      });
    }
  }

  changePrivateKeyInputType() {
    const { inputPrivateKeyType } = this.state;

    if (inputPrivateKeyType === "text") {
      this.setState({
        inputPrivateKeyType: "password",
        showPrivateKeyIconURL: this.iconUrl.open,
      });
    } else {
      this.setState({
        inputPrivateKeyType: "text",
        showPrivateKeyIconURL: this.iconUrl.close,
      });
    }
  }

  async handlePassphrase(values) {
    const valid = await validateYup(values, this.schema);

    if (valid === undefined) {
      this.setState(
        {
          passPhrase: values.passPhrase,
          validPassphrase: true,
        }, () => {
          const { fileDownloaded } = this.state;

          if (!fileDownloaded) {
            this.createAccount();
          }
        }
      );
    } else {
      this.setState({ validPassphrase: false });
    }
  }

  /**
   * Handles account creation and next steps
   * @abstract
   */
  async createAccount() {
  }

  downloadKeyFile() {
    const { ppkData, address } = this.state;

    createAndDownloadJSONFile(`MyPocketNode-${address}`, ppkData);

    this.setState({
      fileDownloaded: true,
    });
  }

  render() {
    const {
      created,
      fileDownloaded,
      inputPassphraseType,
      inputPrivateKeyType,
      showPassphraseIconURL,
      showPrivateKeyIconURL,
      privateKey,
      address,
      redirectPath,
      error,
      loading,
    } = this.state;

    const generalInfo = [
      { title: "0 POKT", subtitle: "Staked tokens" },
      { title: "0 POKT", subtitle: "Balance" },
      { title: Configurations.stakeDefaultStatus, subtitle: "Stake status" },
      {
        title: 0,
        subtitle: "Validator Power",
      },
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
                onClose={() => this.setState({ error: { show: false } })}
              />
            )}
            <h1>Create node</h1>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <h2>Protect your private key with a passphrase</h2>
            <p>
              Write down a Passphrase to protect your key file. This should
              have: minimum of 15 alphanumeric symbols with one capital letter,
              one lowercase letter, one special character and one number.
            </p>
            <Formik
              validationSchema={this.schema}
              onSubmit={(data) => {
                this.setState({ data });
              }}
              initialValues={this.state.data}
              values={this.state.data}
              validateOnChange={false}
              validateOnBlur={false}
              validate={this.handlePassphrase}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  className="create-passphrase-form"
                >
                  <Row className="inputs-row">
                    <Col className="show-passphrase" sm="6">
                      <Form.Group>
                        <Form.Control
                          className={cls({
                            "text-hidden":
                              inputPassphraseType === "password" &&
                              isEmpty(values.passPhrase),
                          })}
                          placeholder="*****************"
                          value={values.passPhrase}
                          type={inputPassphraseType}
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
                        className="toggle-icon"
                        onClick={this.changePassphraseInputType}
                        src={showPassphraseIconURL}
                        alt=""
                      />
                    </Col>
                    <Col sm="6">
                      <LoadingButton
                        loading={loading}
                        buttonProps={{
                          className: cls({ "download-key-file-button": created }),
                          variant: !created ? "primary" : "dark",
                          type: "submit",
                          onClick: created ? this.downloadKeyFile : undefined,
                        }}
                      >
                        <span>
                          {created ? (
                            <img
                              src={"/assets/download.svg"}
                              alt="download-key-file"
                              className="download-key-file-icon"
                            />
                          ) : null}
                          {created ? "Download Key File" : "Create"}
                        </span>
                      </LoadingButton>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row className="inputs-row-read-only">
          <Col className="read-only-with-icon-column" sm="6">
            <h3>Private key</h3>
            <Row>
              <Form.Control
                type={inputPrivateKeyType}
                readOnly
                value={privateKey}
              />
              <img
                className="toggle-icon"
                onClick={this.changePrivateKeyInputType}
                src={showPrivateKeyIconURL}
                alt=""
              />
            </Row>
          </Col>
          <Col sm="6">
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
                  <p className="ml-2">
                    Make a backup, store it and save preferably offline.
                  </p>
                </>
              }
            >
              <p>
                The key file by itself is useless without the passphrase.
                You&#39;ll need the key file in order to import or set up
                your node.
              </p>
            </AppAlert>
          </Col>
        </Row>
        <div style={{ display: "none" }}>
          <Row>
            <Col className="page-title">
              <h1>General information</h1>
            </Col>
          </Row>
          <Row className="stats">
            {generalInfo.map((card, idx) => (
              <Col key={idx}>
                <InfoCard title={card.title} subtitle={card.subtitle}/>
              </Col>
            ))}
          </Row>
          <Row className="mb-5 app-networks">
            <Col>
              <Segment label="Networks">
                <AppTable
                  scroll
                  keyField="hash"
                  data={[]}
                  columns={TABLE_COLUMNS.NETWORK_CHAINS}
                  bordered={false}
                />
              </Segment>
            </Col>
          </Row>
        </div>
        <Row>
          <Col>
            <Button
              disabled={!fileDownloaded}
              onClick={() =>
                // eslint-disable-next-line react/prop-types
                this.props.history.replace(redirectPath)
              }
            >
              <span>Continue</span>
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Passphrase;
