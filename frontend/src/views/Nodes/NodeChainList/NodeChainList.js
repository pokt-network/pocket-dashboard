import React from "react";
import {Button, Col, FormControl, InputGroup, Row, Form} from "react-bootstrap";
import {TABLE_COLUMNS, VALIDATION_MESSAGES} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Chains from "../../../core/components/Chains/Chains";
import Segment from "../../../core/components/Segment/Segment";
import AppTable from "../../../core/components/AppTable";
import {Formik} from "formik";
import * as yup from "yup";
import NodeService from "../../../core/services/PocketNodeService";

class NodeChainList extends Chains {
  constructor(props, context) {
    super(props, context);

    this.handleChains = this.handleChains.bind(this);

    const {serviceURL} = NodeService.getNodeInfo();

    this.state = {
      ...this.state,
      data: {
        ...this.state.data,
        serviceURL: serviceURL || "",
      },
    };
  }

  handleChains() {
    const {chosenChains} = this.state;
    const {serviceURL} = this.state.data;
    const chainsHashes = chosenChains.map((ch) => ch.hash);

    NodeService.saveNodeInfoInCache({
      chains: chainsHashes,
      serviceURL,
    });

    // eslint-disable-next-line react/prop-types
    this.props.history.push(
      _getDashboardPath(DASHBOARD_PATHS.selectValidatorPower)
    );
  }

  render() {
    const {filteredChains, chosenChains} = this.state;
    const chains = filteredChains;

    // Bootstrap Table selectionParams
    const tableSelectOptions = {
      mode: "checkbox",
      clickToSelect: true,
      onSelect: this.onRowSelect,
      onSelectAll: this.onRowSelectAll,
    };

    const schema = yup.object().shape({
      serviceURL: yup
        .string()
        .url(VALIDATION_MESSAGES.URL)
        .required(VALIDATION_MESSAGES.REQUIRED),
    });

    return (
      <div className="choose-chains">
        <Row>
          <Col className="page-title">
            <h1>Choose chains</h1>
            <p>
              Choose the chains you want to connect your app or node to.
              Remember you won&#39;t be able to change these chains until your
              next stake which will be evenly divided on the selected number of
              chains.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <div className="mb-4 d-flex justify-content-between">
              <h2>Supported blockchains</h2>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Segment scroll={false}>
              <Row className="search-panel">
                <Col>
                  <InputGroup className="search-input ml-5 mb-3">
                    <FormControl
                      placeholder="Search a chain"
                      name="searchChainQuery"
                      onChange={this.handleChange}
                      onKeyPress={({key}) => {
                        if (key === "Enter") {
                          this.handleChainSearch();
                        }
                      }}
                    />
                    <InputGroup.Append>
                      <Button
                        type="submit"
                        onClick={this.handleChainSearch}
                        variant="outline-primary"
                      >
                        <img src="/assets/search.svg" alt="search-icon" />
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
              </Row>
              <AppTable
                scroll
                toggle={chains.length > 0}
                keyField="hash"
                data={chains}
                columns={TABLE_COLUMNS.NETWORK_CHAINS}
                selectRow={tableSelectOptions}
                bordered={false}
              />
            </Segment>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Formik
              validationSchema={schema}
              onSubmit={async (data) => {
                this.setState({data});
                await this.handleChains();
              }}
              initialValues={this.state.data}
              values={this.state.data}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({handleSubmit, handleChange, values, errors}) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label className="service-url-label">
                      Service URL. Please provide the endpoint HTTPS of your
                      node.
                    </Form.Label>
                    <Form.Control
                      name="serviceURL"
                      placeholder="https://example.com"
                      value={values.serviceURL}
                      onChange={handleChange}
                      isInvalid={!!errors.serviceURL}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.serviceURL}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button
                    disabled={chosenChains.length <= 0}
                    type="submit"
                    variant="primary"
                    size={"md"}
                    className="mt-4 pl-4 pr-4"
                  >
                    <span>Continue</span>
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NodeChainList;
