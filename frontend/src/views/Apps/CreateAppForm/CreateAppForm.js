import React from "react";
import {Redirect} from "react-router-dom";
import {Button, Col, Form, Row} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {generateIcon, appFormSchema} from "../../../_helpers";
import {BOND_STATUS_STR} from "../../../_constants";
import {Formik} from "formik";
import AppAlert from "../../../core/components/AppAlert";

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
        redirectPath: _getDashboardPath(DASHBOARD_PATHS.appPassphrase),
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

  async handleCreate() {
    const {name, owner, url, contactEmail, description} = this.state.data;
    let {icon} = this.state;

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

      ApplicationService.saveAppInfoInCache({
        address,
        privateKey,
        data: {name},
      });
      this.setState({created: true});
    } else {
      this.setState({error: true});
    }
  }

  render() {
    const {
      created,
      redirectPath,
      redirectParams,
      agreeTerms,
      error,
    } = this.state;

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
          <Col sm="12" md="12" lg="12">
            {error && (
              <AppAlert
                variant="danger"
                title="There was an error creating your app, please try again later."
                dismissible
                onClose={() => this.setState({error: false})}
              />
            )}
            <h1 className="text-uppercase">App Information</h1>
            <p className="info">
              Fill in these quick questions to idenfity your app on the
              dashbord. Fields marked with * are required to continue.
            </p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm="5" md="5" lg="5">
            <Formik
              validationSchema={appFormSchema}
              onSubmit={(data) => {
                this.setState({data});
                this.handleCreate();
              }}
              initialValues={this.state.data}
              values={this.state.data}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({handleSubmit, handleChange, values, errors}) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Application Name*</Form.Label>
                    <Form.Control
                      name="name"
                      placeholder="maximum of 20 characters"
                      value={values.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      Application Developer or Company name*
                    </Form.Label>
                    <Form.Control
                      name="owner"
                      placeholder="maximum of 20 characters"
                      value={values.owner}
                      onChange={handleChange}
                      isInvalid={!!errors.owner}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.owner}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Contact Email*</Form.Label>
                    <Form.Control
                      placeholder="hello@example.com"
                      name="contactEmail"
                      type="email"
                      value={values.contactEmail}
                      onChange={handleChange}
                      isInvalid={!!errors.contactEmail}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactEmail}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      placeholder="www.example.com"
                      name="url"
                      value={values.url}
                      onChange={handleChange}
                      isInvalid={!!errors.url}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.url}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      placeholder="maximum of 150 characters"
                      as="textarea"
                      rows="6"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      isInvalid={!!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="submit mt-2 mb-4">
                    <Button
                      className="pl-5 pr-5"
                      disabled={!agreeTerms}
                      variant="primary"
                      size="md"
                      type="submit"
                    >
                      Continue
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
          <Col sm="7" md="7" lg="7">
            <div className="ml-5 mt-4">
              <ImageFileUpload
                handleDrop={(img) => this.handleDrop(img.preview)}
              />

              <div className="legal-info">
                <ul className="mt-5">
                  <li>
                    <strong>Purchasers</strong> are not buying POKT as an
                    investment with the expectation of profit or appreciation
                  </li>
                  <li>
                    <strong>Purcharsers</strong> are buying POKT to use it.
                  </li>
                  <li>
                    To ensure <strong>purchasers</strong> are bona fide and not
                    investors, the Company has set a purchase maximum per user
                    and requires users must hold POKT for 4 weeks and use (bond
                    and stake) it before transferring to another wallet or
                    selling.
                  </li>
                  <li>
                    <strong>Purchasers</strong> are acquiring POKT for their own
                    account and use, and not with an intention to re-sell or
                    distribute POKT to others.
                  </li>
                </ul>

                <Form.Check
                  checked={agreeTerms}
                  onChange={() => this.setState({agreeTerms: !agreeTerms})}
                  id="terms-checkbox"
                  type="checkbox"
                  label="I agree with these terms and conditions."
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateAppForm;
