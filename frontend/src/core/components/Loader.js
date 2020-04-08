import React, {Component} from "react";
import DotLoader from "react-spinners/DotLoader";
import {PropTypes} from "prop-types";

class Loader extends Component {
  render() {
    const {loading} = this.props;

    return (
      <div id="loader" style={{marginTop: "20vh"}}>
        <DotLoader
          className="loader"
          css={{display: "block", margin: "0 auto"}}
          size={100}
          color={"#44AAE1"}
          loading={loading}
        />
      </div>
    );
  }
}

Loader.defaultProps = {
  loading: true,
};

Loader.propTypes = {
  loading: PropTypes.bool,
};

export default Loader;
