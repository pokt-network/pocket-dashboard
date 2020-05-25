import React from "react";
import {Redirect, Link} from "react-router-dom";
import {Button, Col, Form, Row} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import {BOND_STATUS_STR} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {generateIcon, nodeFormSchema} from "../../../_helpers";
import UserService from "../../../core/services/PocketUserService";
import NodeService from "../../../core/services/PocketNodeService";
import {Formik} from "formik";
import AppAlert from "../../../core/components/AppAlert";

class CreateNodeForm extends CreateForm {
  constructor(props, context) {
    super(props, context);

    this.handleCreate = this.handleCreate.bind(this);
    this.createNode = this.createNode.bind(this);
    this.state = {
      ...this.state,
      data: {
        ...this.state.data,
        operator: "",
        privateKey: "",
      },
      nodeData: {},
      agreeTerms: false,
    };
  }

  async createNode(nodeData) {
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
      ? await NodeService.createNode(nodeData, privateKey)
      : await NodeService.createNode(nodeData);
    const unstakedNode =
      !imported ||
      (imported &&
        (stakeStatus === BOND_STATUS_STR.unbonded ||
          stakeStatus === BOND_STATUS_STR.unbonding));

    if (unstakedNode) {
      this.setState({
        redirectPath: _getDashboardPath(DASHBOARD_PATHS.nodeChainList),
      });
    } else {
      const url = _getDashboardPath(DASHBOARD_PATHS.nodeChainList);

      const detail = url.replace(":address", address);

      this.setState({
        redirectPath: detail,
      });
    }
    return {success, data};
  }

  async handleCreate() {
    // TODO: Change creation process like apps.
    const {name, contactEmail, description, operator} = this.state.data;
    const icon = this.state.icon ? this.state.icon : generateIcon();
    const user = UserService.getUserInfo().email;

    const {success, data} = await this.createNode({
      name,
      operator,
      contactEmail,
      description,
      icon,
      user,
    });

    if (success) {
      const {privateNodeData} = data;
      const {address, privateKey} = privateNodeData;

      NodeService.saveNodeInfoInCache({address, privateKey});
      this.setState({created: true});
    } else {
      // TODO: Show proper error message on front-end.
      console.log(data.message);
    }
  }

  render() {
    const {created, agreeTerms, error} = this.state;

    if (created) {
      return (
        <Redirect
          to={{
            pathname: _getDashboardPath(DASHBOARD_PATHS.nodeChainList),
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
              Fill in these quick questions to identity your node on the
              dashboard. Fields marked with * are required to continue.
            </p>
          </Col>
        </Row>
        <Row>
          <Col sm="5" md="5" lg="5" className="create-form-left-side">
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
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
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

                  <Button
                    className="pl-5 pr-5"
                    disabled={!agreeTerms}
                    variant="primary"
                    type="submit"
                  >
                    <span>Continue</span>
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
          <Col sm="7" md="7" lg="7" className="create-form-right-side">
            <div>
              <ImageFileUpload
                handleDrop={(img) => this.handleDrop(img.preview)}
              />

              <div className="legal-info">
                <ul>
                  <li>
                    <strong>Purchasers</strong> are not buying POKT as an
                    investment with the expectation of profit or appreciation
                  </li>
                  <li>
                    <strong>Purchasers</strong> are buying POKT to use it.
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
                <div className="legal-info-check">
                  <Form.Check
                    checked={agreeTerms}
                    onChange={() => this.setState({agreeTerms: !agreeTerms})}
                    className="terms-checkbox"
                    type="checkbox"
                    label={
                      <p>
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        I agree to these Pocket's{" "}
                        <Link
                          to={_getDashboardPath(DASHBOARD_PATHS.termsOfService)}
                        >
                          Terms and Conditions.
                        </Link>
                      </p>
                    }
                  />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateNodeForm;
