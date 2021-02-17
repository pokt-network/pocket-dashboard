import React from "react";
import PropTypes from "prop-types";
import { Inside } from "use-inside";
import { useViewport } from "use-viewport";
import "styled-components/macro";
import { GU } from "ui/style";

function Split({ primary, secondary, invert, secondaryWidth, ...props }) {
  const { within } = useViewport();
  const oneColumn = within(-1, "medium");

  const inverted =
    (!oneColumn && invert === "horizontal") ||
    (oneColumn && invert === "vertical");

  const primaryContent = (
    <Inside name="Split:primary">
      <div
        css={`
          flex-grow: 1;
          margin-left: ${!oneColumn && inverted ? 5 * GU : 0}px;
          padding-top: ${oneColumn && inverted ? 5 * GU : 0}px;
        `}
      >
        {primary}
      </div>
    </Inside>
  );

  const secondaryContent = (
    <Inside name="Split:secondary">
      <div
        css={`
          flex-shrink: 0;
          flex-grow: 0;
          width: ${secondaryWidth && !oneColumn
            ? secondaryWidth
            : oneColumn
            ? "100%"
            : `${64 * GU}px`};
          margin-left: ${!oneColumn && !inverted ? 5 * GU : 0}px;
          padding-top: ${oneColumn && !inverted ? 5 * GU : 0}px;
        `}
      >
        {secondary}
      </div>
    </Inside>
  );

  return (
    <Inside name="Split">
      <div
        css={`
          display: ${oneColumn ? "block" : "flex"};
          padding-bottom: ${3 * GU}px;
          width: 100%;
        `}
        {...props}
      >
        {inverted ? secondaryContent : primaryContent}
        {inverted ? primaryContent : secondaryContent}
      </div>
    </Inside>
  );
}

Split.propTypes = {
  invert: PropTypes.oneOf(["none", "horizontal", "vertical"]),
  primary: PropTypes.node,
  secondary: PropTypes.node,
  secondaryWidth: PropTypes.string,
};

Split.defaultProps = {
  invert: "none",
};

export { Split };
export default Split;
