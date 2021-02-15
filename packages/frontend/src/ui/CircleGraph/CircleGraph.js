import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Spring, animated } from "react-spring/renderprops";
import "styled-components/macro";
import { useTheme } from "ui/theme";
import { clamp, warnOnce } from "ui/utils";

const STROKE_WIDTH = 4;
const SIZE_DEFAULT = 80;

function labelDefault(animValue, value) {
  const parts = {
    suffix: "%",
    value: String(Math.floor(animValue * 100)),
  };

  const animPercentage = animValue * 100;
  const percentage = value * 100;

  const lessThanOne =
    percentage > 0 &&
    percentage < 1 &&
    animPercentage > 0 &&
    // We know that the actual percentage is less than 1,
    // so this is to avoid a jump with ‚Äú1%‚Äù without prefix.
    animPercentage < 2;

  return lessThanOne ? { ...parts, prefix: "<", value: "1" } : parts;
}

function labelCompat(parts) {
  if (
    typeof parts === "string" ||
    typeof parts === "number" ||
    React.isValidElement(parts)
  ) {
    warnOnce(
      "CircleGraph:label:string",
      "CircleGraph: the function passed to the label should not " +
        "return a React node anymore: please check the CircleGraph documentation."
    );
    return { value: String(parts) };
  }
  return parts;
}

function CircleGraph({ color, label, size, strokeWidth, value }) {
  const theme = useTheme();
  const length = Math.PI * 2 * (size - strokeWidth);
  const radius = (size - strokeWidth) / 2;

  if (label === undefined) {
    label = labelDefault;
  }

  const labelPart = useCallback(
    (name) => (animValue) => {
      if (typeof label !== "function") {
        return null;
      }

      const cValue = clamp(animValue);
      const parts = labelCompat(label(cValue, value));

      return (
        (parts[name] === undefined
          ? labelDefault(cValue, value)[name]
          : parts[name]) || ""
      );
    },
    [label, value]
  );

  const colorFn =
    typeof color === "function" ? color : () => color || theme.accent;

  return (
    <Spring to={{ progressValue: value }} native>
      {({ progressValue }) => (
        <div
          css={`
            position: relative;
            display: flex;
            align-items: center;
            justify-content center;
            width: ${size}px;
            height: ${size}px;
          `}
        >
          <svg
            css={`
              position: absolute;
              top: 0;
              left: 0;
            `}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              style={{ strokeWidth }}
              fill="none"
              stroke={theme.border}
            />
            <animated.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={length}
              strokeWidth={strokeWidth}
              style={{
                stroke: progressValue.interpolate(colorFn),
                strokeDashoffset: progressValue.interpolate(
                  (t) => length - (length * t) / 2
                ),
              }}
              css={`
                transform: rotate(270deg);
                transform-origin: 50% 50%;
              `}
            />
          </svg>
          <div
            css={`
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              line-height: 1.2;
            `}
          >
            {typeof label !== "function"
              ? label
              : label && (
                  <div
                    css={`
                      position: absolute;
                      top: 50%;
                      left: 0;
                      right: 0;
                      transform: translateY(-50%);
                    `}
                  >
                    <div
                      css={`
                        display: flex;
                        align-items: baseline;
                        justify-content: center;
                      `}
                    >
                      <animated.div style={{ fontSize: `${size * 0.2}px` }}>
                        {progressValue.interpolate(labelPart("prefix"))}
                      </animated.div>
                      <animated.div style={{ fontSize: `${size * 0.25}px` }}>
                        {progressValue.interpolate(labelPart("value"))}
                      </animated.div>
                      <animated.div
                        css={`
                          display: flex;
                          color: ${theme.surfaceContentSecondary};
                        `}
                        style={{ fontSize: `${size * 0.13}px` }}
                      >
                        {progressValue.interpolate(labelPart("suffix"))}
                      </animated.div>
                    </div>
                    <animated.div
                      css={`
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        display: flex;
                        justify-content: center;
                        color: ${theme.surfaceContentSecondary};
                      `}
                      style={{ fontSize: `${size * 0.1}px` }}
                    >
                      {progressValue.interpolate(labelPart("secondary"))}
                    </animated.div>
                  </div>
                )}
          </div>
        </div>
      )}
    </Spring>
  );
}

CircleGraph.propTypes = {
  color: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  value: PropTypes.number.isRequired,
};

CircleGraph.defaultProps = {
  size: SIZE_DEFAULT,
  strokeWidth: STROKE_WIDTH,
};

export default CircleGraph;
