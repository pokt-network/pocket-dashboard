import React from "react";
import PropTypes from "prop-types";
import { animated, useSpring } from "react-spring";
import { useViewport } from "use-viewport";
import "styled-components/macro";
import { ButtonBase, useTheme, springs, GU, RADIUS } from "ui";
import ButtonIcon from "components/MenuPanel/ButtonIcon.png";
import PocketLogo from "assets/pnlogo.png";

const MENU_ROUTES = [
  {
    icon: ButtonIcon,
    id: "home",
    title: "Network",
  },
  {
    icon: ButtonIcon,
    id: "apps",
    title: "Apps",
  },
  {
    icon: ButtonIcon,
    id: "docs",
    title: "Docs",
  },
];

export default function MenuPanel() {
  const theme = useTheme();
  const { within } = useViewport();
  const compactMode = within(-1, "medium");
  const [active, setActive] = React.useState(false);

  return (
    !compactMode && (
      <div
        css={`
          width: ${27 * GU}px;
          height: 100vh;
          background: ${theme.surface};
          border-radius: 0px 20px 20px 0;
          flex-grow: 0;
          padding: ${3 * GU}px 0;
          button:not(last-child) {
            margin-bottom: ${7 * GU}px;
          }
        `}
      >
        <ButtonBase
          css={`
            width: 100%;
            position: relative;
            &:active {
              top: 1px;
            }
          `}
        >
          <img src={PocketLogo} alt="Pocket Network Logo link" />
        </ButtonBase>
        {MENU_ROUTES.map(({ icon, id, title }) => (
          <MenuPanelButton
            key={id}
            label={title}
            icon={icon}
            active={active}
            onClick={() => setActive((a) => !a)}
          />
        ))}
      </div>
    )
  );
}

function MenuPanelButton({ label = "test", active, icon, onClick }) {
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
        <img src={icon} alt={`${label} icon`} />
        {label}
      </div>
    </ButtonBase>
  );
}

MenuPanelButton.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.string,
  onClcik: PropTypes.func,
};
