import React from "react";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {Alert, Form, Button, Row, Col} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import ApplicationService from "../../../core/services/PocketApplicationService";
import Loader from "../../../core/components/Loader";
import UserService from "../../../core/services/PocketUserService";
import {Formik} from "formik";
import {appFormSchema} from "../../../_helpers";

class EditApp extends CreateForm {
  constructor(props, context) {
    super(props, context);

    this.handleEdit = this.handleEdit.bind(this);

    this.state = {
      ...this.state,
      loading: true,
      success: false,
    };
  }

  async componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const {address} = this.props.match.params;
    const {pocketApplication} = await ApplicationService.getApplication(
      address
    );
    const {icon, ...appData} = pocketApplication;

    this.setState({loading: false, icon, data: {...appData}});
  }

  async handleEdit() {
    this.setState({success: false});
    const user = UserService.getUserInfo().email;
    const {address} = this.props.match.params;
    const {name, owner, contactEmail, description, url} = this.state.data;
    const {icon} = this.state;

    const {success, data} = await ApplicationService.editApplication(address, {
      name,
      contactEmail,
      description,
      owner,
      url,
      icon,
      user,
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
      <div id="create-form">
        {success && (
          <Alert
            onClose={() => this.setState({success: false})}
            dismissible
            variant="success"
          >
            Your app changes were successfully saved
          </Alert>
        )}
        <Row>
          <Col sm="3" md="3" lg="3">
            <h1>Edit you application</h1>
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
              validationSchema={appFormSchema}
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
                    <Form.Label>Application Developer</Form.Label>
                    <Form.Control
                      name="owner"
                      value={values.owner}
                      onChange={handleChange}
                      isInvalid={!!errors.owner}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.owner}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>URL</Form.Label>
                    <Form.Control
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

export default EditApp;
