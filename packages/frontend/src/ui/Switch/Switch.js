import React, { useState } from "react";
import PropTypes from "prop-types";
import { Spring, animated } from "react-spring/renderprops";
import "styled-components/macro";
import { useTheme } from "ui/theme";
import { noop } from "ui/utils";
import { springs, GU } from "ui/style";
import FocusVisible from "ui/FocusVisible/FocusVisible";

const BORDER = 1;
const WRAPPER_WIDTH = 8 * GU;
const WRAPPER_HEIGHT = 3.6 * GU;

function Switch({ checked, disabled, onChange }) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = disabled ? noop : () => onChange(!checked);

  return (
    <FocusVisible>
      {({ focusVisible, onFocus }) => (
        <span
          onClick={(e) => {
            e.preventDefault();
            handleChange();
          }}
          css={`
            position: relative;
            display: inline-block;
            width: ${WRAPPER_WIDTH}px;
            height: ${WRAPPER_HEIGHT}px;
            border: ${BORDER}px solid ${theme.border};
            border-radius: ${WRAPPER_HEIGHT}px;
            background-color: ${disabled
              ? theme.controlBorder
              : checked
              ? theme.selected
              : theme.control};
            cursor: ${disabled ? "default" : "pointer"};

            ${disabled
              ? ""
              : `
                  &:active {
                    border-color: ${theme.controlBorderPressed};
                  }
                `}

            ${isFocused && focusVisible
              ? `
                  &:after {
                    content: '';
                    position: absolute;
                    left: ${-BORDER * 2}px;
                    top: ${-BORDER * 2}px;
                    width: ${WRAPPER_WIDTH + BORDER * 2}px;
                    height: ${WRAPPER_HEIGHT + BORDER * 2}px;
                    border-radius: ${WRAPPER_HEIGHT}px;
                    border: 2px solid ${theme.focus};
                  }
                `
              : ""};
          `}
        >
          <input
            type="checkbox"
            onFocus={() => {
              setIsFocused(true);
              onFocus();
            }}
            onBlur={() => setIsFocused(false)}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            css={`
              opacity: 0;
              pointer-events: none;
            `}
          />
          <Spring
            to={{
              progress: checked
                ? WRAPPER_WIDTH - WRAPPER_HEIGHT + BORDER
                : BORDER,
            }}
            config={springs.smooth}
            native
          >
            {({ progress }) => (
              <animated.span
                style={{
                  transform: progress.interpolate(
                    (v) => `translate3d(${v}px, 0, 0)`
                  ),
                }}
                css={`
                  position: absolute;
                  left: 0;
                  z-index: 1;
                  top: ${BORDER}px;
                  width: ${WRAPPER_HEIGHT - BORDER * 4}px;
                  height: ${WRAPPER_HEIGHT - BORDER * 4}px;
                  border-radius: ${WRAPPER_HEIGHT - BORDER * 4}px;
                  background-color: ${theme.controlSurface};
                  box-shadow: ${disabled
                    ? "none"
                    : "0px 1px 3px rgba(0, 0, 0, 0.15)"};
                `}
              />
            )}
          </Spring>
        </span>
      )}
    </FocusVisible>
  );
}

Switch.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

Switch.defaultProps = {
  checked: false,
  disabled: false,
  onChange: noop,
};

export default Switch;
