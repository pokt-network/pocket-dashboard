import React from "react";
import { useViewport } from "use-viewport";
import "styled-components/macro";
import { ButtonBase, useTheme, GU } from "ui";
import NavigationBar from "views/Dashboard/NavigationBar";
import MenuPanelButton from "components/MenuPanel/MenuPanelButton";
import PocketLogo from "assets/pnlogo.png";

export default function DashboardView({ children }) {
  const theme = useTheme();
  const { within } = useViewport();
  const compactMode = within(-1, "medium");
  const [active, setActive] = React.useState(false);

  return (
    <div
      css={`
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: row;
        background: #051829;
        color: white;
      `}
    >
      {/* Menu panel */}
      {!compactMode && (
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
      )}
      <main
        css={`
          height: auto;
          overflow-y: scroll;
          flex-grow: 1;
          /* TODO: This won't scale for mobile nor shrinking resolutions. It should be a more flexible margin that diminishes with the viewport's width. */
          max-width: 1152px;
          margin: 0 auto;
          padding-left: ${4 * GU}px;
          padding-right: ${4 * GU}px;
        `}
      >
        <div
          css={`
            /* TODO: This is a bit smelly. Might wanna adopt a spacer component to avoid leaky margins. */
            margin-bottom: ${9 * GU}px;
          `}
        >
          <NavigationBar />
        </div>
        {children}
      </main>
    </div>
  );
}
