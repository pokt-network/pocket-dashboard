import React from "react";
import { useTransition, animated } from "react-spring";
import PropTypes from "prop-types";
import { GU } from "ui";

export default function FloatUp({ loading, fallback, content }) {
  const loadingSwapTransitions = useTransition(loading, null, {
    config: { mass: 1, tension: 200, friction: 20 },
    from: { opacity: 0, transform: `translate3d(0, ${1 * GU}px, 0)` },
    enter: { opacity: 1, transform: `translate3d(0, 0, 0)` },
    leave: {
      opacity: 0,
      position: "absolute",
      transform: `translate3d(0, -${1 * GU}px, 0)`,
    },
  });

  return (
    <div
      css={`
        position: relative;
        width: 100%;
        height: 100%;
      `}
    >
      {loadingSwapTransitions.map(({ item: loading, key, props }) => (
        <animated.div style={props} key={key}>
          {loading ? fallback() : content()}
        </animated.div>
      ))}
    </div>
  );
}

FloatUp.propTypes = {
  loading: PropTypes.bool,
  fallback: PropTypes.func,
  content: PropTypes.func,
};
