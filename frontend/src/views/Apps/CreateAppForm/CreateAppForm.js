import React from "react";
import cls from "classnames";
import {Link, Redirect} from "react-router-dom";
import {Button, Col, Form, Row} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import ApplicationService from "../../../core/services/PocketApplicationService";
import PocketUserService from "../../../core/services/PocketUserService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {appFormSchema, generateIcon, scrollToId, getStakeStatus} from "../../../_helpers";
import {Formik} from "formik";
import AppAlert from "../../../core/components/AppAlert";
import {STAKE_STATUS} from "../../../_constants";
import PocketClientService from "../../../core/services/PocketClientService";
import Segment from "../../../core/components/Segment/Segment";

class CreateAppForm extends CreateForm {
  constructor(props, context) {
    super(props, context);

    this.handleCreate = this.handleCreate.bind(this);
    this.handleCreateImported = this.handleCreateImported.bind(this);

    this.state = {
      ...this.state,
      applicationData: {},
      imported: false,
    };
  }

  componentDidMount() {
    let imported;

    if (this.props.location.state) {
      imported = this.props.location.state.imported;
    }

    if (imported) {
      this.setState({imported});
      PocketUserService.saveUserAction("Import App");

      // Prevent bugs related to leaving form mid-way and accesing again.
      ApplicationService.saveAppInfoInCache({imported:false});
    } else {
      PocketUserService.saveUserAction("Create App");
    }

    this.props.onBreadCrumbChange();
  }

  validateError(err) {
    if (err === "Application already exists.") {
      return "An application with that name already exists, please use a different name.";
    }

    return err;
  }

  async handleCreateImported(applicationId) {
    const {address, ppk} = ApplicationService.getApplicationInfo();
    const data = this.state.data;

    const applicationBaseLink = `${window.location.origin}${_getDashboardPath(
      DASHBOARD_PATHS.appDetail
    )}`;

    const {publicKey} = await PocketClientService.getAccount(address);

    const applicationData = {address, publicKey: publicKey.toString("hex")};

    const {success} = await ApplicationService.saveApplicationAccount(
      applicationId, applicationData, applicationBaseLink, ppk);

    if (success) {
      const {networkData} = await ApplicationService.getApplication(address);

      const {status} = networkData;

      if (getStakeStatus(status) === STAKE_STATUS.Staked) {
        const url = _getDashboardPath(DASHBOARD_PATHS.appDetail);

        const path = url.replace(":id", applicationId);

        this.props.history.push(path);
      } else {
        ApplicationService.saveAppInfoInCache({
          applicationID: applicationId,
          data: data,
        });
        this.props.history.replace(
          _getDashboardPath(DASHBOARD_PATHS.applicationChainsList)
        );
      }
    } else {
      this.setState({error: {show: true, message: data}});
      scrollToId("alert");
    }
  }

  async handleCreate() {
    const {name, owner, url, contactEmail, description} = this.state.data;
    let {icon, imported} = this.state;

    if (!icon) {
      icon = generateIcon();
    }

    const user = PocketUserService.getUserInfo().email;

    const {success, data} = await ApplicationService.createApplication({
      name,
      owner,
      url,
      contactEmail,
      description,
      icon,
      user,
    });

    if (success) {
      if (imported) {
        this.handleCreateImported(data);
      } else {
        ApplicationService.saveAppInfoInCache({
          applicationID: data,
          data: {name},
        });
        this.setState({
          created: true,
          redirectPath: _getDashboardPath(DASHBOARD_PATHS.appPassphrase),
        });
      }
    } else {
      this.setState({error: {show: true, message: this.validateError(data)}});
      scrollToId("alert");
    }
  }

  render() {
    const {
      created,
      redirectPath,
      redirectParams,
      error,
      imgError,
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
      <div className="create-form">
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
            <h1>App Information</h1>
            <p className="info">
              Fill in these few quick questions to identify your app on the
              Dashboard. Fields mark with <b>* </b>are required to continue.
              <br />
              If you have an existing account in Pocket Network with an assigned
              Private Key and you want to register it as an app, please proceed
              to{" "}
              <Link to={_getDashboardPath(DASHBOARD_PATHS.importApp)}>
                Import Application.
              </Link>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="create-form-left-side" style={{marginTop: "-40px"}}>
            <Segment bordered scroll={false}>
              <div className="checking-margin-test" style={{padding: "50px"}}>
                <Formik
                  validationSchema={appFormSchema}
                  onSubmit={async (data) => {
                    this.setState({data});
                    await this.handleCreate();
                  }}
                  initialValues={this.state.data}
                  values={this.state.data}
                  validateOnChange={false}
                  validateOnBlur={false}
                >
                  {({handleSubmit, handleChange, values, errors}) => (
                    <Form noValidate onSubmit={handleSubmit}>
                      <Row>
                        <Col sm="1" md="1" lg="1" style={{paddingLeft: "0px"}}>
                          <ImageFileUpload
                            handleDrop={(img, error) => {
                              const imgResult = img === null ? undefined : img;

                              this.handleDrop(imgResult ?? undefined, error);
                            }}
                          />
                          {imgError && <p className="error mt-2 ml-3">{imgError}</p>}
                        </Col>
                        <Col style={{paddingLeft: "0px"}}>
                          <Form.Group>
                            <Form.Label>
                              Application Name
                      <span className={cls({"has-error": !!errors.name})}>
                                *
                      </span>
                            </Form.Label>
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
                        </Col>
                        <Col style={{paddingLeft: "0px"}}>
                          <Form.Group>
                            <Form.Label>
                              Application Developer or Company name
                      <span className={cls({"has-error": !!errors.owner})}>
                                *
                      </span>
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
                        </Col>
                      </Row>
                      <Row style={{marginTop: "20px"}}>
                        <Col style={{paddingLeft: "0px"}}>
                          <Form.Group>
                            <Form.Label>
                              Contact Email
                      <span
                                className={cls({"has-error": !!errors.contactEmail})}
                              >
                                *
                      </span>
                            </Form.Label>
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
                        </Col>
                        <Col style={{paddingLeft: "0px"}}>
                          <Form.Group>
                            <Form.Label>Website</Form.Label>
                            <Form.Control
                              placeholder="https://www.example.com"
                              name="url"
                              value={values.url}
                              onChange={handleChange}
                              isInvalid={!!errors.url}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.url}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group>
                        <Form.Label>
                          Write an optional description of your app here. This
                          information is private and will not be shared outside of
                          your personal dashboard.
                    </Form.Label>
                        <Form.Control
                          placeholder="maximum of 150 characters"
                          as="textarea"
                          rows="4"
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        disabled={false}
                        variant="primary"
                        type="submit"
                      >
                        <span>Continue</span>
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </Segment>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateAppForm;
