import numeral from "numeral";
import {BOND_STATUS} from "./_constants";

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

export const mapStatusToApp = (app) => {
  return {
    ...app,
    networkData: {
      ...app.networkData,
      status: BOND_STATUS[app.networkData.status],
    },
  };
};
