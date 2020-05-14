import numeral from "numeral";
import {BOND_STATUS, STAKE_STATUS, VALIDATION_MESSAGES} from "./_constants";
import Identicon from "identicon.js";
import * as yup from "yup";
import _ from "lodash";

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
      status: getStakeStatus(app.networkData.status),
    },
  };
};

export const generateIcon = () => {
  const currTime = new Date().getTime();

  // Use current time as a 'hash' to generate icon of 250x250
  return `data:image/png;base64,${new Identicon(
    `${currTime}${currTime / 2}`, 250).toString()}`;
};

export const getStakeStatus = (status) => {
  return typeof status === "string"
    ? STAKE_STATUS[status]
    : BOND_STATUS[status];
};

// noinspection DuplicatedCode
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

// noinspection DuplicatedCode
export const nodeFormSchema = yup.object().shape({
  name: yup
    .string()
    .max(20, VALIDATION_MESSAGES.MAX(20))
    .required(VALIDATION_MESSAGES.REQUIRED),
  operator: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  url: yup.string().url(VALIDATION_MESSAGES.URL),
  contactEmail: yup
    .string()
    .email(VALIDATION_MESSAGES.EMAIL)
    .required(VALIDATION_MESSAGES.REQUIRED),
  description: yup.string().max(150, VALIDATION_MESSAGES.MAX(150)),
});

export const validateYup = async (values, schema) => {
  let errors = {};
  let yupErrors;

  await schema.validate(values, {abortEarly: false}).catch((err) => {
    errors = err;
  });

  if (!_.isEmpty(errors)) {
    yupErrors = {};
    errors.inner.forEach((err) => {
      yupErrors[err.path] = err.message;
    });
  }

  return yupErrors;
};
