import React from "react";
import {Redirect} from "react-router-dom";
import {Button, Col, Form, Row} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import CreateForm from "../../components/CreateForm/CreateForm";

class CreateNodeForm extends CreateForm {
  constructor(props, context) {
    super(props, context);

    this.handleCreate = this.handleCreate.bind(this);
    this.state = {
      ...this.state,
      data: {
        ...this.state.data,
        privateKey: "",
      },
      applicationData: {},
    };
  }

  async handleCreate(e) {
    e.preventDefault();
    // TODO: Integrate node creation with backend
  }

  render() {
    const {
      name,
      owner,
      url,
      contactEmail,
      description,
      privateKey,
    } = this.state.data;
    const {created, applicationData} = this.state;

    if (created) {
      return (
        <Redirect
          to={{
            pathname: _getDashboardPath(DASHBOARD_PATHS.chooseChain),
            state: {applicationData},
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
                <Form.Label>Private key</Form.Label>
                <Form.Control
                  name="privateKey"
                  value={privateKey}
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
