export const BONDSTATUS = {
  0: "Bonded",
  1: "Unbonding",
  2: "Unbonded",
};

export const BOND_STATUS_STR = {
  bonded: 0,
  unbonding: 1,
  unbonded: 2,
};

export const APPLICATIONS_LIMIT = 10;

export const NETWORK_TABLE_COLUMNS = [
  {
    dataField: "name",
    text: "Network",
  },
  {
    dataField: "netID",
    text: "Network Identifier (NetID)",
  },
  {
    dataField: "hash",
    text: "Hash",
  },
];

export const MAX_RELAYS = 20000;
