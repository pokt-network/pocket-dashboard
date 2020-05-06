import React from "react";
import {Redirect} from "react-router-dom";
import {Button, Col, Form, Row} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {generateIcon} from "../../../_helpers";
import {BOND_STATUS_STR} from "../../../_constants";

class CreateAppForm extends CreateForm {
  constructor(props, context) {
    super(props, context);

    this.handleCreate = this.handleCreate.bind(this);
    this.createApplication = this.createApplication.bind(this);
    this.state = {
      ...this.state,
      applicationData: {},
      redirectPath: "",
      redirectParams: {},
      agreeTerms: false,
    };
  }

  async createApplication(applicationData) {
    let imported;
    let stakeStatus;
    let address;
    let privateKey;

    if (this.props.location.state !== undefined) {
      stakeStatus = this.props.location.state.stakeStatus;
      address = this.props.location.state.address;
      privateKey = this.props.location.state.privateKey;
      imported = this.props.location.state.imported;
    } else {
      imported = false;
    }

    const {success, data} = imported
      ? await ApplicationService.createApplication(applicationData, privateKey)
      : await ApplicationService.createApplication(applicationData);

    const unstakedApp =
      !imported ||
      (imported &&
        (stakeStatus === BOND_STATUS_STR.unbonded ||
          stakeStatus === BOND_STATUS_STR.unbonding));

    if (unstakedApp) {
      this.setState({
        redirectPath: _getDashboardPath(DASHBOARD_PATHS.chooseChain),
      });
    } else {
      const url = _getDashboardPath(DASHBOARD_PATHS.appDetail);

      const detail = url.replace(":address", address);

      this.setState({
        redirectPath: detail,
        redirectParams: {
          message: "For new purchase first unstake please!",
          purchase: false,
        },
      });
    }
    return {success, data};
  }

  async handleCreate(e) {
    e.preventDefault();

    const {name, owner, url, contactEmail, description} = this.state.data;
    let {icon} = this.state;

    // TODO: Show proper message on front end to user on validation error
    if (name === "" || contactEmail === "" || owner === "") {
      console.log("missing required field");
    }

    if (!icon) {
      icon = generateIcon();
    }

    const user = UserService.getUserInfo().email;

    const {success, data} = await this.createApplication({
      name,
      owner,
      url,
      contactEmail,
      description,
      icon,
      user,
    });

    if (success) {
      const {privateApplicationData} = data;
      const {address, privateKey} = privateApplicationData;

      ApplicationService.saveAppInfoInCache({address, privateKey});
      this.setState({created: true});
    } else {
      // TODO: Show proper error message on front-end.
      console.log(data);
    }
  }

  render() {
    const {name, owner, url, contactEmail, description} = this.state.data;
    const {created, redirectPath, redirectParams, agreeTerms} = this.state;

    if (created) {
      return (
        <Redirect
          to={{
            pathname: redirectPath,
            state: redirectParams,
          }}
        />
      );
    }

    return (
      <div id="create-form">
        <Row>
          <Col sm="3" md="3" lg="3">
            <h1>App Information</h1>
            <p>The fields with (*) are required to continue</p>
          </Col>
        </Row>
        <Row>
          <Col sm="3" md="3" lg="3">
            <ImageFileUpload
              handleDrop={(img) => this.handleDrop(img.preview)}
            />
          </Col>
          <Col sm="9" md="9" lg="9">
            <Form onSubmit={this.handleCreate}>
              <Form.Group>
                <Form.Label>Name*</Form.Label>
                <Form.Control
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Application Developer*</Form.Label>
                <Form.Control
                  name="owner"
                  value={owner}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>URL</Form.Label>
                <Form.Control
                  name="url"
                  value={url}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Contact email*</Form.Label>
                <Form.Control
                  name="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="6"
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <div className="legal-info">
                <p>
                  - Purchasers are not buying POKT as an investment with the
                  expectation of profit or appreciation - Purcharsers are buying
                  POKT to use it.
                </p>
                <p>
                  - To ensure purchasers are bona fide and not investors, the
                  Company has set a purchase maximun per user and requires users
                  must hold POKT for 4 weeks and use (bond and stake) it before
                  transferring to another wallet or selling.
                </p>
                <p>
                  - Purchasers are acquiring POKT for their own account and use,
                  and not with an intention to re-sell or distribute POKT to
                  others.
                </p>
              </div>

              <div className="submit mt-2 mb-4 d-flex justify-content-between">
                <Form.Check
                  custom
                  checked={agreeTerms}
                  onChange={() => this.setState({agreeTerms: !agreeTerms})}
                  id="terms-checkbox"
                  type="checkbox"
                  label="I agree with these terms and conditions."
                />
                <Button
                  disabled={!agreeTerms}
                  variant="dark"
                  size="lg"
                  type="submit"
                >
                  Continue
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateAppForm;
