import numeral from "numeral";
import {BOND_STATUS, STAKE_STATUS} from "./_constants";
import Identicon from "identicon.js";

export const formatCurrency = (amount) => numeral(amount).format("$0,0.00");

export const copyToClickboard = (value) => {
  const el = document.createElement("textarea");

  el.value = value;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

export const isActiveExactUrl = (match, location) => {
  if (!match) {
    return false;
  }

  return match.url === location.pathname;
};

export const mapStatusToField = (app) => {
  return {
    ...app,
    networkData: {
      ...app.networkData,
      status: getBondStatus(app.networkData.status),
    },
  };
};

export const generateIcon = () => {
  const currTime = new Date().getTime();

  // Use current time as a 'hash' to generate icon of 250x250
  const identicon = `data:image/png;base64,${new Identicon(
    `${currTime}${currTime / 2}`, 250).toString()}`;

  return identicon;
};

export const getBondStatus = (status) => {
  return typeof status === "string"
    ? STAKE_STATUS[status]
    : BOND_STATUS[status];
};
