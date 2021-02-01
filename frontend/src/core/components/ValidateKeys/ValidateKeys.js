import React, { Component } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { PropTypes } from "prop-types";
import PocketClientService from "../../services/PocketClientService";

class ValidateKeys extends Component {
  constructor(props, context) {
    super(props, context);

    this.validateAccount = this.validateAccount.bind(this);
    this.changeInputType = this.changeInputType.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.iconUrl = {
      open: "/assets/open_eye.svg",
      close: "/assets/closed_eye.svg",
    };

    this.state = {
      ppk: "",
      created: false,
      error: { show: false, message: "" },
      hasPPK: false,
      inputType: "password",
      validPassphrase: false,
      showPassphraseIconURL: this.iconUrl.open,
      address: "",
      uploadedPrivateKey: "",
      chains: [],
      ppkFileName: "Upload your key file",
      data: {
        passphrase: "",
        privateKey: "",
        ppkData: "",
      },
      redirectPath: "",
      redirectParams: {},
      validated: false,
    };
  }

  componentDidMount() {
    const { breadcrumbs, handleBreadcrumbs } = this.props;

    if (handleBreadcrumbs) {
      handleBreadcrumbs(breadcrumbs);
    }
  }

  handleChange({ currentTarget: input }) {
    const data = { ...this.state.data };

    data[input.name] = input.value;
    this.setState({ data });
  }

  changeInputType() {
    const { inputType } = this.state;

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

  readUploadedFile = e => {
    e.preventDefault();
    const reader = new FileReader();
    const ppkFileName = e.target.files[0].name;

    reader.onload = e => {
      const { result } = e.target;
      const { data } = this.state;
      const ppkData = JSON.parse(result.trim());

      this.setState({
        ppkFileName,
        hasPPK: true,
        data: { ...data, privateKey: "", ppkData },
      });
    };

    reader.readAsText(e.target.files[0], "utf8");
  };

  async validateAccount(e) {
    e.preventDefault();

    const { address } = this.props;
    const { privateKey, passphrase, ppkData } = this.state.data;
    let ppk;

    if (!passphrase) {
      this.setState({
        error: { show: true, message: "Your passphrase cannot be empty" },
      });
      return;
    }

    if (!ppkData) {
      ppk = JSON.parse(
        await PocketClientService.createPPKFromPrivateKey(
          privateKey,
          passphrase
        )
      );
    } else {
      ppk = ppkData;
    }

    const account = await PocketClientService.saveAccount(
      JSON.stringify(ppk),
      passphrase
    );
    const { addressHex } = account;

    const validated = addressHex === address;

    if (validated) {
      this.setState({
        error: { show: false },
        validated: true,
        address: address,
        ppk: ppk,
      });
    } else {
      this.setState({
        error: {
          show: true,
          message: "Invalid private key / passphrase",
        },
      });
    }
  }

  render() {
    const {
      inputType,
      showPassphraseIconURL,
      uploadedPrivateKey,
      hasPPK,
      error,
      validated,
      ppk,
      ppkFileName,
    } = this.state;

    const { passphrase, privateKey } = this.state.data;

    const {
      children,
      handleAfterValidate,
      address,
      actionButtonName,
      className,
    } = this.props;

    return (
      <div id="app-passphrase" className="import">
        {children && (
          <Row>
            <Col className={`page-title ${className}`}>{children}</Col>
          </Row>
        )}
        <Row className="validate-keys">
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
                      value={uploadedPrivateKey}
                    />
                    <div className="file">
                      <label
                        htmlFor="upload-key"
                        className="upload-key btn btn-primary"
                      >
                        <span className="pr-4 pl-4">Upload key file</span>
                      </label>
                      <input
                        style={{ display: "none" }}
                        id="upload-key"
                        type="file"
                        onChange={e => this.readUploadedFile(e)}
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
                          disabled={privateKey.length === 0}
                          onClick={() => {
                            this.setState({ hasPPK: true });
                          }}
                        >
                          <span>continue </span>
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
                          className="validate invalid-account"
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
                            !validated
                              ? this.validateAccount
                              : e => {
                                  e.preventDefault();
                                  handleAfterValidate({
                                    address,
                                    ppk,
                                    passphrase,
                                  });
                                }
                          }
                        >
                          <span>
                            {!validated ? actionButtonName : "Continue"}
                          </span>
                        </Button>
                      </Form.Group>
                    </>
                  )}
                </Col>
              </Form.Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

ValidateKeys.defaultProps = {
  breadcrumbs: [],
  actionButtonName: "Verify",
  className: "",
};

ValidateKeys.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  address: PropTypes.string,
  handleAfterValidate: PropTypes.func,
  breadcrumbs: PropTypes.array,
  handleBreadcrumbs: PropTypes.func,
  actionButtonName: PropTypes.string,
  className: PropTypes.string,
};

export default ValidateKeys;
