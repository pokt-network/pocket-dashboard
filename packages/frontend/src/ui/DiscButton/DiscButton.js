import React from "react";
import PropTypes from "prop-types";
import "styled-components/macro";
import { GU } from "ui/style";
import { useTheme } from "ui/theme";
import ButtonBase from "ui/ButtonBase/ButtonBase";

const DiscButton = React.forwardRef(
  ({ children, description, size, ...props }, ref) => {
    const theme = useTheme();

    return (
      <ButtonBase
        ref={ref}
        focusRingSpacing={4}
        focusRingRadius={size}
        title={description}
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          width: ${size}px;
          height: ${size}px;
          background: ${theme.help};
          color: ${theme.helpContent};
          border-radius: 50%;

          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
          transition-property: transform, box-shadow;
          transition-duration: 50ms;
          transition-timing-function: ease-in-out;

          &:active {
            transform: translateY(1px);
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.125);
          }
        `}
        {...props}
      >
        {children}
      </ButtonBase>
    );
  }
);

DiscButton.propTypes = {
  children: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  size: PropTypes.number,
};

DiscButton.defaultProps = {
  size: 5 * GU,
};

export default DiscButton;
