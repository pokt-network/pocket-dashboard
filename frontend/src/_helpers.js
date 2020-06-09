import React from "react";
import numeral from "numeral";
import {BOND_STATUS, DEFAULT_POKT_DENOMINATION_BASE, STAKE_STATUS, VALIDATION_MESSAGES} from "./_constants";
import * as IdentIcon from "identicon.js";
import * as yup from "yup";
import _ from "lodash";
import moment from "moment";

export const formatCurrency = (amount) => numeral(amount).format("$0,0.00");

export const formatNumbers = (num) => numeral(num).format("0,0");

export const formatNetworkData = (
  pokt,
  fixed = true,
  poktDenominationBase = DEFAULT_POKT_DENOMINATION_BASE
) => {
  const poktNumber = pokt / Math.pow(10, poktDenominationBase);

  return fixed
    ? formatNumbers(poktNumber)
    : numeral(poktNumber).format("0,0.0");
};

export const createAndDownloadJSONFile = (fileName, data) => {
  const element = document.createElement("a");
  const file = new File([JSON.stringify(data)], fileName, {
    type: "application/json",
  });

  element.href = URL.createObjectURL(file);
  element.download = `${fileName}.json`;

  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
};

export const isActiveExactUrl = (match, location) => {
  if (!match) {
    return false;
  }

  return match.url === location.pathname;
};

export const isActiveUrl = (match, location, name) => {
  if (!match) {
    return false;
  }

  return location.pathname.includes(name.toLowerCase());
};


export const mapStatusToField = (item) => {
  return {
    ...item,
    status: getStakeStatus(_.isNumber(item.status) ? item.status : parseInt(item.status)),
  };
};

export const generateIcon = () => {
  const currTime = new Date().getTime();

  // Use current time as a 'hash' to generate icon of 250x250
  return `data:image/png;base64,${new IdentIcon(
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

export const passwordChangeSchema = yup.object().shape({
  password1: yup
    .string()
    .min(8, VALIDATION_MESSAGES.MIN(8))
    .required(VALIDATION_MESSAGES.REQUIRED),
  password2: yup
    .string()
    .required(VALIDATION_MESSAGES.REQUIRED)
    .oneOf([yup.ref("password1"), null], "Passwords must match"),
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

export const scrollToId = (id) => {
  const elmnt = document.getElementById(id);

  elmnt.scrollIntoView();
};

export const tableShow = (table, handleClick) => {
  const showFormatter = (column) => {
    return (
      <span className="show-icon d-flex justify-content-between">
        <span>{column.text}</span>{" "}
        <img
          onClick={handleClick}
          className="icon"
          src={"/assets/arrow.svg"}
          alt=""
        />
      </span>
    );
  };

  const tableFormatted = [...table];
  const formatter = Object.assign({}, table[table.length - 1]);

  formatter.headerFormatter = showFormatter;
  tableFormatted[tableFormatted.length - 1] = formatter;
  return tableFormatted;
};

export const formatDaysCountdown = (time, daysFromTime) => {
  const now = moment(new Date());
  const eventTime = moment(time).add(daysFromTime, "days");
  const duration = moment.duration(eventTime.diff(now));
  const days = duration.days().toString().padStart(2, "0");
  const hours = duration.hours().toString().padStart(2, "0");
  const minutes = duration.minutes().toString().padStart(2, "0");

  return `${days}:${hours}:${minutes}`;
};

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
