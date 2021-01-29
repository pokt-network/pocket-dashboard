import React from "react";
import { Button, Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import { TABLE_COLUMNS, URL_HTTPS_REGEX, VALIDATION_MESSAGES } from "../../../_constants";
import { _getDashboardPath, DASHBOARD_PATHS } from "../../../_routes";
import AppAlert from "../../../core/components/AppAlert";
import Chains from "../../../core/components/Chains/Chains";
import Segment from "../../../core/components/Segment/Segment";
import AppTable from "../../../core/components/AppTable";
import { Formik } from "formik";
import * as yup from "yup";
import NodeService from "../../../core/services/PocketNodeService";

class NodeChainList extends Chains {
  constructor(props, context) {
    super(props, context);

    this.handleChains = this.handleChains.bind(this);

    this.state = {
      ...this.state,
      data: {
        ...this.state.data,
        serviceURL: "",
      },
    };
  }

  async componentDidMount() {
    super.componentDidMount();

    const { address } = NodeService.getNodeInfo();

    const { networkData } = await NodeService.getNode(address);

    this.setState({
      data: { serviceURL: networkData.service_url },
    });
  }

  handleChains() {
    const { chosenChains } = this.state;
    const { serviceURL } = this.state.data;
    const chainsHashes = chosenChains.map((ch) => ch._id);

    NodeService.saveNodeInfoInCache({
      chains: chainsHashes,
      serviceURL,
      chainsObject: chosenChains
    });
    const { address } = NodeService.getNodeInfo();

    // eslint-disable-next-line react/prop-types
    this.props.history.push(
      _getDashboardPath(`${DASHBOARD_PATHS.nodeDetail.replace(/:address/, address)}`)
    );
  }

  render() {
    const { filteredChains, chosenChains } = this.state;
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
        .matches(URL_HTTPS_REGEX, VALIDATION_MESSAGES.URL)
        .required(VALIDATION_MESSAGES.REQUIRED),
    });

    return (
      <div className="choose-chains">
        <Row>
          <Col className="page-title">
            <h1>Choose chains</h1>
            <p>
              Choose the chains that your Pocket Node will service. Your staked POKT will be evenly divided between these selections. You will not be able to change this selection unless you unstake and restake your node.
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="page-title">
            <h2>Supported blockchains</h2>
          </Col>
        </Row>
        <Row>
          <Segment bordered scroll={false}>
            <Row className="search-panel">
              <InputGroup className="search-input">
                <FormControl
                  placeholder="Search a chain"
                  name="searchChainQuery"
                  onChange={this.handleChange}
                  onKeyPress={({ key }) => {
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
            </Row>
            <AppTable
              scroll
              toggle={chains.length > 0}
              keyField="_id"
              data={chains}
              columns={TABLE_COLUMNS.NETWORK_CHAINS}
              selectRow={tableSelectOptions}
              bordered={false}
            />
          </Segment>
        </Row>
        <Row>
          <Col className="page-title">
            <h2>Service URL</h2>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col style={{ paddingLeft: "0px" }}>
            <Formik
              enableReinitialize
              validationSchema={schema}
              onSubmit={async (data) => {
                this.setState({ data });
                await this.handleChains();
              }}
              initialValues={this.state.data}
              values={this.state.data}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label className="service-url-label">
                      Please provide the HTTPS endpoint of your Pocket Node. <a rel="noopener noreferrer" target="_blank" href="https://docs.pokt.network/docs/faq-for-nodes#section-what-is-the-service-uri">What is the service URL?</a>
                    </Form.Label>
                    <Form.Control
                      name="serviceURL"
                      placeholder="https://example.com:443"
                      value={values.serviceURL}
                      onChange={handleChange}
                      isInvalid={!!errors.serviceURL}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.serviceURL}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row className="mt-4">
                    <Col style={{ paddingLeft: "0px" }}>
                      <AppAlert
                        className="pb-4 pt-4"
                        variant="warning"
                        title={
                          <>
                            <h4 className="text-uppercase">
                              WARNING, BEFORE YOU CONTINUE!{" "}
                            </h4>
                            <p className="ml-2">
                            </p>
                          </>
                        }
                      >
                        <p ref={(el) => {
                          if (el) {
                            el.style.setProperty("font-size", "14px", "important");
                          }
                        }}>
                          The key file by itself is useless without the passphrase.
                          You&#39;ll need the key file in order to import or set up
                          your node.
                Before continuing, be aware that we are not responsible of any jailing or slashing that may incur due to mis-configuration of your node. If you are not completely sure if your node is configured, <a rel="noopener noreferrer" target="_blank" href="https://docs.pokt.network/docs/testing-your-node">click here</a> and make sure you have done all of the steps and tested your node BEFORE you continue.
              </p>
                      </AppAlert>
                    </Col>
                  </Row>
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
