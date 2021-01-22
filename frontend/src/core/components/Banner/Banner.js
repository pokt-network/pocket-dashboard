import React, {useState, useEffect} from "react";
import {animated, useTransition} from "react-spring";
import "./Banner.scss";

const BANNER_HEIGHT = 48;
const BANNER_TIMEOUT = 15 * 1000 // 30 secs

function ConvictionBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timeout;

    if (visible) {
      timeout = setTimeout(() => setVisible(false), BANNER_TIMEOUT);
    }

    return () => clearTimeout(timeout);
  }, [visible]);

  const transitions = useTransition(visible, null, {
    from: {height: 0},
    enter: {height: BANNER_HEIGHT},
    leave: {height: 0},
  });

  return transitions.map(({item: visible, key, props}) => {
    return (
      visible && (
        <animated.div
          key={key}
          style={{...props, overflow: "hidden"}}
          class="top_banner"
        >
          <p>
            Some features regarding node staking and app payments have been
            disabled as we work on the next version of the dashboard.{" "}
            <a
              href="https://pokt.network"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </a>
          </p>
        </animated.div>
      )
    );
  });
}

export default ConvictionBanner;
