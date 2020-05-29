import React from "react";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {Button, Col, Form, Row} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import Loader from "../../../core/components/Loader";
import NodeService from "../../../core/services/PocketNodeService";
import UserService from "../../../core/services/PocketUserService";
import {Formik} from "formik";
import {nodeFormSchema} from "../../../_helpers";
import AppAlert from "../../../core/components/AppAlert";

class EditNode extends CreateForm {
  constructor(props, context) {
    super(props, context);

    this.handleEdit = this.handleEdit.bind(this);

    this.state = {
      ...this.state,
      loading: true,
      success: false,
      data: {
        ...this.state.data,
        operator: "",
      },
    };
  }

  async componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const {address} = this.props.match.params;
    const {pocketNode} = await NodeService.getNode(address);
    const {icon, ...appData} = pocketNode;

    this.setState({loading: false, icon, data: {...appData}});
  }

  async handleEdit() {
    this.setState({success: false});
    const user = UserService.getUserInfo().email;
    const {address} = this.props.match.params;
    const {name, operator, contactEmail, description} = this.state.data;
    const {icon} = this.state;

    const {success, data} = await NodeService.editNode(address, {
      name,
      contactEmail,
      description,
      icon,
      user,
      operator,
    });

    if (success) {
      this.setState({success: true});
    } else {
      this.setState({error: {show: true, message: data}});
    }
  }

  render() {
    const {loading, icon, success, error} = this.state;

    if (loading) {
      return <Loader />;
    }

    return (
      <div className="create-form">
        <Row>
          <Col sm="12" md="12" lg="12">
            {success && (
              <AppAlert
                onClose={() => this.setState({success: false})}
                dismissible
                title="Your app changes were successfully saved"
              />
            )}
            {error.show && (
              <AppAlert
                variant="danger"
                title={error.message}
                dismissible
                onClose={() => this.setState({error: false})}
              />
            )}
            <h1 className="text-uppercase">App Information</h1>
            <p className="info">
              Fill in these quick questions to identity your app on the
              dashboard. Fields marked with * are required to continue.
            </p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm="5" md="5" lg="5">
            <Formik
              validationSchema={nodeFormSchema}
              onSubmit={(data) => {
                this.setState({data});
                this.handleEdit();
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

                  <Button className="" variant="primary" type="submit">
                    <span>Continue</span>
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
          <Col sm="7" md="7" lg="7">
            <div className="ml-5 mt-4">
              <ImageFileUpload
                defaultImg={icon}
                handleDrop={(img) => this.handleDrop(img.preview)}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EditNode;
