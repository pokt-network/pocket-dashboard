import React from "react";
import PropTypes from "prop-types";
import { Root } from "ui/Root/Root";
import BaseStyles from "ui/BaseStyles/BaseStyles";

export default function AppWrapper({ children }) {
  return (
    <Root.Provider>
      <BaseStyles />
      {children}
    </Root.Provider>
  );
}

AppWrapper.propTypes = {
  children: PropTypes.node,
};
