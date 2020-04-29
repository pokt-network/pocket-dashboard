import React from "react";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {Alert, Form, Button, Row, Col} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import ApplicationService from "../../../core/services/PocketApplicationService";
import Loader from "../../../core/components/Loader";
import UserService from "../../../core/services/PocketUserService";

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

  async handleEdit(e) {
    e.preventDefault();

    this.setState({success: false});
    const user = UserService.getUserInfo().email;
    const {address} = this.props.match.params;
    const {name, owner, contactEmail, description, url} = this.state.data;
    const {icon} = this.state;

    // TODO: Show proper message on front end to user on validation error
    if (name === "" || contactEmail === "" || owner === "") {
      console.log("missing required field");
    }

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
    const {name, owner, url, contactEmail, description} = this.state.data;
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
            <Form onSubmit={this.handleEdit}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Application Developer</Form.Label>
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
                <Form.Label>Contact email</Form.Label>
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

              <div className="submit float-right mt-2">
                <Button variant="dark" size="lg" type="submit">
                  Continue
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EditApp;