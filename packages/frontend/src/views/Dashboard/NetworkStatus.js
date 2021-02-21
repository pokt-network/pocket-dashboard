import React from "react";
import { useViewport } from "use-viewport";
import "styled-components/macro";
import {
  CircleGraph,
  LineChart,
  Split,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  textStyle,
  GU,
  RADIUS,
} from "ui";
import FloatUp from "components/FloatUp/FloatUp";

const LINES = [{ id: 1, values: [0.1, 0.8, 0.4, 1] }];

const LABELS = ["", "", "", ""];

export default function NetworkStatus() {
  const { within } = useViewport();
  const compactMode = within(-1, "medium");

  return (
    <FloatUp
      loading={false}
      content={() => (
        <>
          <Split
            primary={
              <Box title="Total Relays">
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    span {
                      margin: ${1 * GU}px;
                    }
                  `}
                >
                  <span
                    css={`
                      display: inline-block;
                      background: #ffffff;
                      border-radius: 50%;
                      width: 16px;
                      height: 16px;
                    `}
                  />{" "}
                  245,000
                </div>
                <LineChart
                  lines={LINES}
                  label={(index) => LABELS[index]}
                  backgroundFill="#1B2331"
                  height={150}
                  color={() => `#ffffff`}
                  borderColor={`rgba(0,0,0,0)`}
                />
              </Box>
            }
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
            primary={
              <Box
                title="Available chains"
                css={`
                  ${!compactMode &&
                  `
          max-height: ${56 * GU}px;
          overflow-y: scroll;
        `}
                `}
              >
                <div
                  css={`
                    ${!compactMode &&
                    `
                max-height: ${35 * GU}px;
                overflow-y: scroll;
              `}
                  `}
                >
                  <Table
                    noSideBorders
                    noTopBorders
                    css={`
                      background: transparent;
                    `}
                    header={
                      <>
                        <TableRow>
                          <TableHeader title="Network" />
                          <TableHeader title="Network ID" />
                          <TableHeader title="Ticker" />
                          <TableHeader title="Node count" />
                          <TableHeader title="Staked apps" />
                        </TableRow>
                      </>
                    }
                  >
                    <TableRow>
                      <TableCell>
                        <p>Ethereum Mainnet</p>
                      </TableCell>
                      <TableCell>
                        <p>0021</p>
                      </TableCell>
                      <TableCell>
                        <p>ETH</p>
                      </TableCell>
                      <TableCell>
                        <p>600</p>
                      </TableCell>
                      <TableCell>
                        <p>1400</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <p>Ethereum Mainnet</p>
                      </TableCell>
                      <TableCell>
                        <p>0021</p>
                      </TableCell>
                      <TableCell>
                        <p>ETH</p>
                      </TableCell>
                      <TableCell>
                        <p>600</p>
                      </TableCell>
                      <TableCell>
                        <p>1400</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <p>Ethereum Mainnet</p>
                      </TableCell>
                      <TableCell>
                        <p>0021</p>
                      </TableCell>
                      <TableCell>
                        <p>ETH</p>
                      </TableCell>
                      <TableCell>
                        <p>600</p>
                      </TableCell>
                      <TableCell>
                        <p>1400</p>
                      </TableCell>
                    </TableRow>
                  </Table>
                </div>
              </Box>
            }
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
                    li:not(:last-child) {
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
          />{" "}
        </>
      )}
    />
  );
}

function Box({ children, title, ...props }) {
  return (
    <div
      css={`
        background: #1b2331;
        min-height: 280px;
        padding: ${2 * GU}px ${4 * GU}px;
        border-radius: ${RADIUS / 2}px;
      `}
      {...props}
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
