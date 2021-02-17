import React from "react";
import { animated, useSpring } from "react-spring";
import "styled-components/macro";
import { ButtonBase, useTheme, springs, GU, RADIUS } from "ui";
import ButtonIcon from "components/MenuPanel/ButtonIcon.png";

export default function MenuPanelButton({ label = "test", active, onClick }) {
  const { openProgress } = useSpring({
    to: { openProgress: Number(active) },
    config: springs.smooth,
  });
  const theme = useTheme();

  return (
    <ButtonBase
      css={`
        position: relative;
        width: 100%;
        height: ${12 * GU}px;
        border-radius: 0px;
        color: black;
        transition: background 150ms ease-in-out;
        background: ${active ? theme.surfacePressed : "transparent"};
      `}
      onClick={onClick}
    >
      <animated.div
        css={`
          position: absolute;
          left: 0;
          width: 3px;
          height: 100%;
          background: ${theme.accent};
          border-radius: ${RADIUS}px;
        `}
        style={{
          opacity: openProgress,
          transform: openProgress.interpolate(
            (v) => `translate3d(-${(1 - v) * 100}%, 0, 0)`
          ),
        }}
      />
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            display: block;
            width: ${8 * GU}px;
            height: ${8 * GU}px;
          }
        `}
      >
        <img src={ButtonIcon} alt={`${label} icon`} />
        {label}
      </div>
    </ButtonBase>
  );
}
