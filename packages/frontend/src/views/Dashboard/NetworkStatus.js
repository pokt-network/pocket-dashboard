import React from "react";
import "styled-components/macro";
import { CircleGraph, Split, textStyle, GU, RADIUS } from "ui";

export default function NetworkStatus() {
  return (
    <>
      <Split
        primary={<Box title="Total Relays">klk con klk</Box>}
        secondary={
          <Box title="Relay Success rate">
            <CircleGraph
              color="white"
              size={30 * GU}
              strokeWidth={10}
              value={0.74}
            />
          </Box>
        }
        css={`
          margin-bottom: ${10 * GU}px;
        `}
      />
      <Split
        primary={<Box title="Available chains">klk con klk</Box>}
        secondaryWidth={`${80 * GU}px;`}
        secondary={
          <Box title="Network stats">
            <ul
              css={`
                list-style: none;
                height: 100%;
                li {
                  display: flex;
                  justify-content: space-between;
                }
                li:not(last-child) {
                  margin-bottom: ${6 * GU}px;
                }
              `}
            >
              <li>
                Total apps staked: <span>1,000</span>
              </li>
              <li>
                Total nodes staked: <span>1,900</span>
              </li>
              <li>
                Total POKT staked: <span>2,000,000</span>
              </li>
              <li>
                POKT price: <span>$0.13 USD</span>
              </li>
            </ul>
          </Box>
        }
        invert="horizontal"
      />
    </>
  );
}

function Box({ children, title }) {
  return (
    <div
      css={`
        background: #1b2331;
        min-height: 280px;
        padding: ${2 * GU}px ${4 * GU}px;
        border-radius: ${RADIUS / 2}px;
      `}
    >
      <h3
        css={`
          ${textStyle("title3")}
          margin-bottom: ${5 * GU}px;
        `}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}
