import numeral from "numeral";
import {BOND_STATUS, STAKE_STATUS, VALIDATION_MESSAGES} from "./_constants";
import Identicon from "identicon.js";
import * as yup from "yup";

export const formatCurrency = (amount) => numeral(amount).format("$0,0.00");

export const formatNumbers = (num) => numeral(num).format("0,0");

export const copyToClipboard = (value) => {
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

export const appFormSchema = yup.object().shape({
  name: yup
    .string()
    .max(20, VALIDATION_MESSAGES.MAX(20))
    .required(VALIDATION_MESSAGES.REQUIRED),
  owner: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  url: yup.string().url(VALIDATION_MESSAGES.URL),
  contactEmail: yup
    .string()
    .email(VALIDATION_MESSAGES.EMAIL)
    .required(VALIDATION_MESSAGES.REQUIRED),
  description: yup.string().max(150, VALIDATION_MESSAGES.MAX(150)),
});
