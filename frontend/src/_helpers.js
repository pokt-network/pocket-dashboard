import numeral from "numeral";

export const formatCurrency = (amount) => numeral(amount).format("$0,0.00");

export const copyToClickboard = (value) => {
  const el = document.createElement("textarea");

  el.value = value;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};
