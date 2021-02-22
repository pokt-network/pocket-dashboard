import React, { useState, useEffect, useMemo, useCallback } from "react";
import { animated, useTransition } from "react-spring";
import "styled-components/macro";
import {
  Button,
  ButtonBase,
  Help,
  IconPlus,
  Split,
  Switch,
  TextCopy,
  TextInput,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  springs,
  textStyle,
  GU,
  RADIUS,
} from "ui";
import FloatUp from "components/FloatUp/FloatUp";
import { log } from "lib/utils";

const APP_CONFIG_DATA_KEY = "POKT_NETWORK_APP_CONFIG_DATA";
const APP_CONFIG_SCREEN_KEY = "POKT_NETWORK_APP_CONFIG_SREEN";

const UPDATE_TYPES = new Map([
  ["UPDATE_APP_NAME", "appName"],
  ["UPDATE_SELECTED_NETWORK", "selectedNetwork"],
  ["UPDATE_WHITELISTED_USER_AGENTS", "whitelistedUserAgents"],
  ["UPDATE_WHITELISTED_ORIGINS", "whitelistedOrigins"],
  ["UPDATE_REQUIRE_PRIVATE_SECRET", "requirePrivateSecret"],
]);

const SCREENS = new Map([
  [0, BasicSetup],
  [1, SecuritySetup],
]);

function loadConfigureState() {
  const appConfigData = localStorage.getItem(APP_CONFIG_DATA_KEY);
  const screenIndex = localStorage.getItem(APP_CONFIG_SCREEN_KEY);

  try {
    const deserializedConfigData = JSON.parse(appConfigData);
    const deserializedScreenIndex = JSON.parse(screenIndex);

    return {
      appConfigData: deserializedConfigData,
      screenIndex: Number(deserializedScreenIndex) ?? 0,
    };
  } catch (err) {
    // This might look weird at first, but we've got no good way to tell if
    // failure to deserialize this data is a browser issue, or just people
    // cleaning their localStorage data, so we just assume the happy path.
    return {};
  }
}

function useConfigureState() {
  const [appConfigData, setAppConfigData] = useState(null);
  const [prevScreenIndex, setPrevScreenIndex] = useState(-1);
  const [screenIndex, setScreenIndex] = useState(0);

  useEffect(() => {
    const { appConfigData, screenIndex } = loadConfigureState();

    setAppConfigData(appConfigData);
    setScreenIndex(screenIndex);
  }, []);

  const updateAppConfigData = useCallback(
    (action) => {
      const keyToUpdate = UPDATE_TYPES.get(action.type);

      if (!keyToUpdate) {
        throw new Error(`No key matching ${action.type} was found.`);
      }

      const newAppConfigData = {
        ...appConfigData,
        [keyToUpdate]: action.payload,
      };

      log("New App Config Data", newAppConfigData);

      setAppConfigData(newAppConfigData);
    },
    [appConfigData]
  );

  const incrementScreenIndex = useCallback(() => {
    setPrevScreenIndex(screenIndex);
    setScreenIndex((screenIndex) => screenIndex + 1);
  }, [screenIndex]);

  const decrementScreenIndex = useCallback(() => {
    setPrevScreenIndex(screenIndex);
    setScreenIndex((screenIndex) => screenIndex - 1);
  }, [screenIndex]);

  return {
    appConfigData,
    decrementScreenIndex,
    incrementScreenIndex,
    prevScreenIndex,
    screenIndex,
    updateAppConfigData,
  };
}

export default function Create() {
  const {
    appConfigData,
    decrementScreenIndex,
    incrementScreenIndex,
    prevScreenIndex,
    screenIndex,
    updateAppConfigData,
  } = useConfigureState();

  const direction = screenIndex > prevScreenIndex ? 1 : -1;

  log(appConfigData, screenIndex);

  const ActiveScreen = useMemo(() => SCREENS.get(screenIndex) ?? null, [
    screenIndex,
  ]);

  const transitionProps = useTransition(screenIndex, null, {
    from: {
      opacity: 0,
      position: "absolute",
      transform: `translate3d(${10 * direction}%, 0, 0)`,
    },
    enter: {
      opacity: 1,
      position: "static",
      transform: `translate3d(0%, 0, 0)`,
    },
    leave: {
      opacity: 0,
      position: "absolute",
      transform: `translate3d(${-10 * direction}%, 0, 0)`,
    },
    config: springs.smooth,
    immediate: screenIndex === 0 && prevScreenIndex === -1,
  });

  return (
    <FloatUp
      loading={false}
      content={() => (
        <div
          css={`
            width: 100%;
            position: relative;
            overflow-x: hidden;
          `}
        >
          {transitionProps.map(({ _, key, props }) => (
            <animated.div
              key={key}
              style={props}
              css={`
                top: 0;
                left: 0;
                right: 0;
              `}
            >
              <ActiveScreen
                data={appConfigData}
                decrementScreen={decrementScreenIndex}
                incrementScreen={incrementScreenIndex}
                updateData={updateAppConfigData}
              />
            </animated.div>
          ))}
        </div>
      )}
    />
  );
}

function Box({ children, title, ...props }) {
  return (
    <div
      css={`
        background: #1b2331;
        padding: ${2 * GU}px ${4 * GU}px;
        padding-bottom: ${4 * GU}px;
        border-radius: ${RADIUS / 2}px;
      `}
      {...props}
    >
      {title && (
        <h3
          css={`
            ${textStyle("title3")}
          `}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function BasicSetup({ data, decrementScreen, incrementScreen, updateData }) {
  return (
    <>
      <Split
        primary={
          <Box
            title="App name"
            css={`
              h3 {
                margin-bottom: ${3 * GU}px;
              }
            `}
          >
            <TextInput
              value={data?.appName ?? ""}
              onChange={(e) =>
                updateData({
                  type: "UPDATE_APP_NAME",
                  payload: e.target.value,
                })
              }
              placeholder="New App Name"
              wide
            />
          </Box>
        }
        secondary={
          <Box title="Free-tier info">
            <ul
              css={`
                list-style: none;
                height: 100%;
                li {
                  display: flex;
                  justify-content: space-between;
                }
                li:not(:last-child) {
                  margin-bottom: ${4 * GU}px;
                }
              `}
            >
              <li>
                Amount of POKT: <span>25,000</span>
              </li>
              <li>
                Max relays per day: <span>1M</span>
              </li>
            </ul>
          </Box>
        }
      />
      <Split
        primary={
          <Box title="Available networks">
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
          </Box>
        }
        secondary={
          <Button wide onClick={() => incrementScreen()}>
            Set up app security
          </Button>
        }
      />
    </>
  );
}

function SecuritySetup({ data, decrementScreen, incrementScreen, updateData }) {
  const [userAgent, setUserAgent] = useState("");
  const [origin, setOrigin] = useState("");

  const stringifiedData = JSON.stringify(data);

  const setWhitelistedUserAgent = useCallback(() => {
    const whitelistedUserAgents = data?.whitelistedUserAgents ?? [];

    updateData({
      type: "UPDATE_WHITELISTED_USER_AGENTS",
      payload: [...whitelistedUserAgents, userAgent],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedData, updateData, userAgent]);

  const setWhitelistedOrigin = useCallback(() => {
    const whitelistedOrigins = data?.whitelistedOrigins ?? [];

    updateData({
      type: "UPDATE_WHITELISTED_ORIGINS",
      payload: [...whitelistedOrigins, origin],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedData, origin, updateData]);

  return (
    <>
      <Split
        primary={
          <Box>
            <p
              css={`
                ${textStyle("body2")}
                margin-bottom: ${2 * GU}px;
              `}
            >
              To maximize security for your application, you may add an
              additional private secret key or whitelist user agents and
              origins. For more information take a look Pocket Gateway Docs.
            </p>
            <p
              css={`
                ${textStyle("body2")}
              `}
            >
              Activate Private Secret to project secret for all requests
            </p>
          </Box>
        }
        secondary={
          <div
            css={`
              display: flex;
              flex-direction: column;
              height: 100%;
              justify-content: space-between;
            `}
          >
            <Button wide onClick={() => decrementScreen()}>
              Back to basic setup
            </Button>
            <Box
              css={`
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              `}
            >
              <div
                css={`
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                `}
              >
                <h3
                  css={`
                    ${textStyle("body2")}
                    margin-right: ${1 * GU}px;
                  `}
                >
                  Private Secret Required
                </h3>
                <Help hint="What is this?">
                  Turn this on if you wanna have an "extra" layer of security
                  for all of your requests. You'll have to send a secret
                  password with each request that we will verify.
                </Help>
              </div>
              <Switch
                checked={data?.requirePrivateSecret ?? false}
                onChange={() =>
                  updateData({
                    type: "UPDATE_REQUIRE_PRIVATE_SECRET",
                    payload: !data?.requirePrivateSecret,
                  })
                }
              />
            </Box>
          </div>
        }
      />
      <Box
        title="Whitelisted user-agents"
        css={`
          h3 {
            margin-bottom: ${1 * GU}px;
          }
          margin-bottom: ${3 * GU}px;
        `}
      >
        <TextInput
          wide
          value={userAgent}
          onChange={(e) => setUserAgent(e.target.value)}
          adornment={
            <ButtonBase onClick={setWhitelistedUserAgent}>
              <IconPlus />
            </ButtonBase>
          }
          adornmentPosition="end"
        />
        <ul
          css={`
            list-style: none;
            margin-top: ${2 * GU}px;
            li:not(:last-child) {
              margin-bottom: ${2 * GU}px;
            }
          `}
        >
          {data?.whitelistedUserAgents?.map((agent) => (
            <li key={agent}>
              <TextCopy
                onCopy={() => log("killao")}
                value={agent}
                css={`
                  width: 100%;
                `}
              />
            </li>
          ))}
        </ul>
      </Box>
      <Box
        title="Whitelisted origins"
        css={`
          h3 {
            margin-bottom: ${1 * GU}px;
          }
        `}
      >
        <TextInput
          wide
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          adornment={
            <ButtonBase onClick={setWhitelistedOrigin}>
              <IconPlus />
            </ButtonBase>
          }
          adornmentPosition="end"
        />
        <ul
          css={`
            list-style: none;
            margin-top: ${2 * GU}px;
            li:not(:last-child) {
              margin-bottom: ${2 * GU}px;
            }
          `}
        >
          {data?.whitelistedOrigins?.map((origin) => (
            <li key={origin}>
              <TextCopy
                onCopy={() => log("killao")}
                value={origin}
                css={`
                  width: 100%;
                `}
              />
            </li>
          ))}
        </ul>
      </Box>
    </>
  );
}
