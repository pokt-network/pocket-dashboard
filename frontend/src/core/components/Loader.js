import React, {Component} from "react";
import BarLoader from "react-spinners/BarLoader";
import {PropTypes} from "prop-types";

class Loader extends Component {
  render() {
    const {loading} = this.props;

    return (
      <div className="pocket-loader">
        <BarLoader
          className="loader"
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
