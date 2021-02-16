import React from "react";
import BaseStyles from "../src/ui/BaseStyles/BaseStyles";
import { Root } from "../src/ui/Root/Root";

export const decorators = [
  (Story) => (
    <Root.Provider>
      <div style={{ width: "100%", height: "100%", minHeight: "500px" }}>
        <BaseStyles />
        <Story />
      </div>
    </Root.Provider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
