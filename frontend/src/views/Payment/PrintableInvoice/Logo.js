import React from "react";
import {Row} from "react-bootstrap";

class Logo extends React.Component {
  render() {
    return (
      <Row className="justify-content-center">
        <img src={"/assets/logo-dashboard-color.svg"} alt="logo" width={750} height={170} />
      </Row>
    );
  }
}

export default Logo;
