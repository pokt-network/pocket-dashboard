import React, {Component} from "react";
import {Row, Col, Form, Button} from "react-bootstrap";
import AccountService from "../../services/PocketAccountService";
import {PropTypes} from "prop-types";

class ValidateKeys extends Component {
  constructor(props, context) {
    super(props, context);

    this.validateApp = this.validateApp.bind(this);
    this.changeInputType = this.changeInputType.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.iconUrl = {
      open: "/assets/open_eye.svg",
      close: "/assets/closed_eye.svg",
    };

    this.state = {
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
      redirectPath: "",
      redirectParams: {},
      validated: false,
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

  async validateApp(e) {
    e.preventDefault();

    const {address} = this.props;

    const {privateKey, passphrase} = this.state.data;

    const {success, data} = await AccountService.importAccount(
      privateKey, passphrase);

    const validated = success && data.address === address;

    if (validated) {
      this.setState({validated: true, address: data.address});
    } else {
      this.setState({
        error: {
          show: true,
          message: data.message
            ? data.message
            : "Invalid public key / passphrase",
        },
      });
    }
  }

  render() {
    const {
      inputType,
      showPassphraseIconURL,
      uploadedPrivateKey,
      hasPrivateKey,
      error,
      validated,
    } = this.state;

    const {passphrase, privateKey} = this.state.data;

    const {children, handleAfterValidate, address} = this.props;

    return (
      <div id="app-passphrase" className="import">
        {children && (
          <Row>
            <Col className="page-title">{children}</Col>
          </Row>
        )}
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
                        Upload key file
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
                            this.setState({hasPrivateKey: true});
                          }}
                        >
                          Import
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
                          onClick={this.changeInputType}
                          src={showPassphraseIconURL}
                          alt=""
                        />
                        <Button
                          variant="dark"
                          type="submit"
                          onClick={
                            !validated
                              ? this.validateApp
                              : (e) => {
                                  e.preventDefault();
                                  handleAfterValidate({
                                    address,
                                    privateKey,
                                    passphrase,
                                  });
                                }
                          }
                        >
                          {!validated ? "Validate" : "Continue"}
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

ValidateKeys.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  address: PropTypes.string,
  handleAfterValidate: PropTypes.func,
};

export default ValidateKeys;
