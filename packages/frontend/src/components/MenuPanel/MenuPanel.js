import React from "react";
import { useViewport } from "use-viewport";
import "styled-components/macro";
import { ButtonBase, useTheme, GU } from "ui";
import MenuPanelButton from "components/MenuPanel/MenuPanelButton";
import PocketLogo from "assets/pnlogo.png";

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
        <MenuPanelButton
          label="Network"
          active={active}
          onClick={() => setActive((a) => !a)}
        />
      </div>
    )
  );
}
