export const profile = {
  items: [
    {
      name: "General Information",
      url: "/dashboard/profile",
      icon: "user_icon",
    },
    {
      name: "Change your password",
      url: "/dashboard/profile/password-change",
      icon: "key",
    },
    {
      name: "Payment method",
      url: "/dashboard/profile/payments",
      icon: "payment_methods",
    },
    {
      name: "Payment History",
      url: "/dashboard/profile/payment-history",
      icon: "payment_history",
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
    // TODO: Uncomment when second release
    // {
    //   name: "Nodes",
    //   url: "/dashboard/nodes",
    //   icon: "menu/nodes.svg",
    // },
    // {
    //   name: "Support",
    //   url: "/dashboard/Documentation",
    //   icon: "menu/support.svg",
    // },
  ],
};
