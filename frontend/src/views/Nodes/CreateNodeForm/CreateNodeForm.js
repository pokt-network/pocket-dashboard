import React from "react";
import {Redirect} from "react-router-dom";
import {Col, Form, Row} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {generateIcon, nodeFormSchema, scrollToId, getStakeStatus} from "../../../_helpers";
import UserService from "../../../core/services/PocketUserService";
import PocketUserService from "../../../core/services/PocketUserService";
import NodeService from "../../../core/services/PocketNodeService";
import {Formik} from "formik";
import AppAlert from "../../../core/components/AppAlert";
import {STAKE_STATUS} from "../../../_constants";
import PocketClientService from "../../../core/services/PocketClientService";
import Segment from "../../../core/components/Segment/Segment";
import LoadingButton from "../../../core/components/LoadingButton";

class CreateNodeForm extends CreateForm {
  constructor(props, context) {
    super(props, context);

    this.handleCreate = this.handleCreate.bind(this);
    this.state = {
      ...this.state,
      data: {
        ...this.state.data,
        operator: "",
        privateKey: "",
      },
      nodeData: {},
      agreeTerms: true,
      imported: false,
      added: false,
    };
  }

  componentDidMount() {
    let imported;

    if (this.props.location.state) {
      imported = this.props.location.state.imported;
    }

    if (imported) {
      this.setState({imported});
      PocketUserService.saveUserAction("Import Node");
    } else {
      PocketUserService.saveUserAction("Create Node");
    }

    this.props.onBreadCrumbChange();
  }

  validateError(err) {
    if (err === "Error: Node already exists") {
      return "A node with that name already exists, please use a different name.";
    }

    return err;
  }

  async handleCreateImported(nodeID) {
    const {address, ppk} = NodeService.getNodeInfo();
    const data = this.state.data;

    const url = _getDashboardPath(DASHBOARD_PATHS.nodeDetail);
    const nodeDetail = url.replace(":address", address);

    const nodeBaseLink = `${window.location.origin}${nodeDetail}`;

    const {publicKey} = await PocketClientService.getUnlockedAccount(address);

    const nodeData = {address, publicKey: publicKey.toString("hex")};

    const {success} = await NodeService.saveNodeAccount(
      nodeID, nodeData, nodeBaseLink, ppk
    );

    if (success) {
      const {networkData} = await NodeService.getNode(address);

      const {status} = networkData;

      if (getStakeStatus(status) === STAKE_STATUS.Staked) {
        this.props.history.replace(nodeDetail);
      } else {
        NodeService.saveNodeInfoInCache({
          data: data,
        });
        this.props.history.replace(
          _getDashboardPath(DASHBOARD_PATHS.nodeChainList)
        );
      }
    } else {
      this.setState({adding: false, error: {show: true, message: data}});
      scrollToId("alert");
    }
  }

  async handleCreate() {
    const {name, contactEmail, description, operator} = this.state.data;
    const {imported} = this.state;
    const icon = this.state.icon ? this.state.icon : generateIcon();
    const user = UserService.getUserInfo().email;

    this.setState({adding: true});

    const {success, data} = await NodeService.createNode({
      name,
      operator,
      contactEmail,
      description,
      icon,
      user,
    });

    if (success) {
      if (imported) {
        this.handleCreateImported(data);
        return;
      } else {
        NodeService.saveNodeInfoInCache({nodeID: data, data: {name}});
      }

      this.setState({
        created: true,
        redirectPath: _getDashboardPath(DASHBOARD_PATHS.nodePassphrase),
      });
    } else {
      this.setState({
        adding: false,
        error: {
          show: true,
          message: this.validateError(data.message)
        }
      });
      scrollToId("alert");
    }
  }

  render() {
    const {created, agreeTerms, error, redirectPath, imgError, adding} = this.state;

    if (created) {
      return (
        <Redirect
          to={{
            pathname: redirectPath,
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
            <h1>Node Information</h1>
            <p className="info">
              Fill in these questions to identify your node on your
              dashboard. Fields marked with (*) are required to continue.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="create-form-left-side" style={{marginTop: "-40px"}}>
            <Segment bordered scroll={false}>
              <div className="checking-margin-test" style={{padding: "50px"}}>
                <Formik
                  validationSchema={nodeFormSchema}
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
                        <Col sm="5" md="5" lg="5">
                          <Form.Group>
                            <Form.Label>Node Name*</Form.Label>
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
                      </Row>
                      <br />
                      <Row>
                        <Col style={{paddingLeft: "0px"}}>
                          <Form.Group>
                            <Form.Label>Node operator or Company name*</Form.Label>
                            <Form.Control
                              name="operator"
                              placeholder="maximum of 20 characters"
                              value={values.operator}
                              onChange={handleChange}
                              isInvalid={!!errors.operator}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.operator}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col style={{paddingRight: "0px"}}>
                          <Form.Group>
                            <Form.Label>Contact Email*</Form.Label>
                            <Form.Control
                              name="contactEmail"
                              type="email"
                              placeholder="hello@example.com"
                              value={values.contactEmail}
                              onChange={handleChange}
                              isInvalid={!!errors.contactEmail}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.contactEmail}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group>
                        <Form.Label>Write an optional description of your node here</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows="6"
                          name="description"
                          placeholder="maximum of 150 characters"
                          value={values.description}
                          onChange={handleChange}
                          isInvalid={!!errors.description}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.description}
                        </Form.Control.Feedback>
                      </Form.Group>
                        <LoadingButton
                          className="pl-5 pr-5"
                          disabled={!agreeTerms}
                          loading={adding}
                          buttonProps={{
                            variant: "primary",
                            type: "submit"
                          }}
                        >
                        <span>Continue</span>
                        </LoadingButton>
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

export default CreateNodeForm;
