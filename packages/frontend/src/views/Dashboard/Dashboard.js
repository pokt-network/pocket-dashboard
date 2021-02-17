import React from "react";
import { useViewport } from "use-viewport";
import "styled-components/macro";
import { useTheme, GU } from "ui";
import NavigationBar from "views/Dashboard/NavigationBar";

export default function DashboardView({ children }) {
  const theme = useTheme();
  const { within } = useViewport();
  const compactMode = within(-1, "medium");

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
          `}
        ></div>
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
