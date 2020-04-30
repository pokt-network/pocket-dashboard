import React from "react";
import {Redirect} from "react-router-dom";
import {Button, Col, Form, Row} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import {BOND_STATUS_STR} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {generateIdenticon} from "../../../_helpers";
import UserService from "../../../core/services/PocketUserService";
import NodeService from "../../../core/services/PocketNodeService";

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
        redirectPath: _getDashboardPath(DASHBOARD_PATHS.chooseChain),
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

  async handleCreate(e) {
    // TODO: Implement app import

    e.preventDefault();
    const {name, contactEmail, description, operator} = this.state.data;
    const icon = this.state.icon ? this.state.icon : generateIdenticon();
    const user = UserService.getUserInfo().email;

    // TODO: Show proper message on front end to user on validation error
    if (name === "" || contactEmail === "") {
      console.log("missing required field");
      return;
    }

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
    const {name, operator, contactEmail, description} = this.state.data;
    const {created} = this.state;

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
      <div id="create-form">
        <Row>
          <Col sm="3" md="3" lg="3">
            <h1>Node Information</h1>
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
                <Form.Label>Operator*</Form.Label>
                <Form.Control
                  name="operator"
                  value={operator}
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

              <div className="submit float-right mt-2">
                <Button variant="dark" size="lg" type="submit">
                  Continue
                </Button>
                <p>
                  By continuing you agree to Pocket&apos;s <br />
                  {/*TODO: Add terms and conditions link*/}
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                  <a className="link" href="#">
                    Terms and conditions
                  </a>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateNodeForm;
