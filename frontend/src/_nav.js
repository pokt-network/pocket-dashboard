export const profile = {
  items: [
    {
      name: "General Information",
      url: "/dashboard/profile",
      icon: "profile/user_icon.svg",
    },
    {
      name: "Change your password",
      url: "/dashboard/profile/password-change",
      icon: "profile/key.svg",
    },
    {
      name: "Payment methods",
      url: "/dashboard/profile/payments",
      icon: "profile/payment_methods.svg",
    },
    {
      name: "Payment History",
      url: "/dashboard/profile/payment-history",
      icon: "profile/payment_history.svg",
    },
  ],
};

export default {
  items: [
    {
      name: "Network Status",
      url: "/dashboard",
      icon: "menu/network-status.svg",
    },
    {
      name: "Apps",
      url: "/dashboard/apps",
      icon: "menu/apps.svg",
    },
    {
      name: "Nodes",
      url: "/dashboard/nodes",
      icon: "menu/nodes.svg",
    },

    {
      name: "Documentation",
      url: "https://pocket-dashboard.document360.io/docs",
      icon: "menu/Documentation.svg",
      isExternal: true,
    },
  ],
};
