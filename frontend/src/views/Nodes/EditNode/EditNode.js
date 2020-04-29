import React from "react";
import CreateForm from "../../../core/components/CreateForm/CreateForm";
import {Alert, Form, Button, Row, Col} from "react-bootstrap";
import ImageFileUpload from "../../../core/components/ImageFileUpload/ImageFileUpload";
import Loader from "../../../core/components/Loader";
import NodeService from "../../../core/services/PocketNodeService";
import UserService from "../../../core/services/PocketUserService";

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

  async handleEdit(e) {
    e.preventDefault();

    this.setState({success: false});
    const user = UserService.getUserInfo().email;
    const {address} = this.props.match.params;
    const {name, owner, contactEmail, description} = this.state.data;
    const {icon} = this.state;

    // TODO: Show proper message on front end to user on validation error
    if (name === "" || contactEmail === "" || owner === "") {
      console.log("missing required field");
    }

    const {success, data} = await NodeService.editNode(address, {
      name,
      contactEmail,
      description,
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
    const {name, owner, contactEmail, description} = this.state.data;
    const {loading, success} = this.state;

    if (loading) {
      return <Loader />;
    }

    return (
      <div id="create-form">
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
                <Form.Label>Node Operator</Form.Label>
                <Form.Control
                  name="operator"
                  value={owner}
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
                  Save
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EditNode;
