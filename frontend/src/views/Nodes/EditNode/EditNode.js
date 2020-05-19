import React from "react";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {Alert, Button, Col, Form, Row} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import Loader from "../../../core/components/Loader";
import NodeService from "../../../core/services/PocketNodeService";
import UserService from "../../../core/services/PocketUserService";
import {Formik} from "formik";
import {nodeFormSchema} from "../../../_helpers";

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
      operator
    });

    if (success) {
      this.setState({success: true});
    } else {
      // TODO: Show frontend message
      console.log(data);
    }
  }

  render() {
    const {loading, icon, success} = this.state;

    if (loading) {
      return <Loader />;
    }

    return (
      <div className="create-form">
        {success && (
          <Alert
            variant="success"
            onClose={() => this.setState({sucess: false})}
            dismissible
          >
            Your changes were successfully saved.
          </Alert>
        )}
        <Row>
          <Col sm="3" md="3" lg="3">
            <h1>Edit your Node</h1>
          </Col>
        </Row>
        <Row>
          <Col sm="3" md="3" lg="3">
            <ImageFileUpload
              defaultImg={icon}
              handleDrop={(img) => this.handleDrop(img.preview)}
            />
          </Col>
          <Col sm="9" md="9" lg="9">
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
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Node operator</Form.Label>
                    <Form.Control
                      name="operator"
                      value={values.operator}
                      onChange={handleChange}
                      isInvalid={!!errors.operator}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.operator}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Contact email</Form.Label>
                    <Form.Control
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
                    <Form.Label>Description</Form.Label>
                    <Form.Control
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

                  <div className="submit float-right mt-2">
                    <Button variant="dark" size="lg" type="submit">
                      Save
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EditNode;
