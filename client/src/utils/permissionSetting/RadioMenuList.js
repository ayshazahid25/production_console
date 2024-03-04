const RadioMenuList = [
  {
    Settings: [
      {
        dashboard: { title: 'Dashboard', none: false, view: true, viewEdit: true, admin: false },
      },

      {
        usersPermissions: {
          title: 'Users Permissions',
          none: true,
          view: true,
          viewEdit: true,
          admin: true,
          note: 'Warning: by granting this right you are making this user a superuser',
        },
      },
    ],
  },
  {
    Inventory: [
      {
        manageInventoryOrAddAProduct: {
          title: 'Manage Inventory/Add a Product',
          none: true,
          view: false,
          viewEdit: true,
          admin: false,
        },
      },
      {
        manageFBAInventoryShipments: {
          title: 'Manage FBA Inventory/Shipments',
          none: true,
          view: false,
          viewEdit: true,
          admin: false,
        },
      },
      {
        manageCategories: {
          title: 'Manage Categories',
          none: true,
          view: true,
          viewEdit: true,
          admin: true,
        },
      },
      {
        marketplaces: {
          title: 'Marketplaces',
          none: true,
          view: true,
          viewEdit: true,
          admin: true,
        },
      },
    ],
  },
  {
    Orders: [
      {
        manageOrders: {
          title: 'Manage Orders',
          none: true,
          view: true,
          viewEdit: true,
          admin: true,
        },
      },

      {
        manageRefunds: {
          title: 'Manage Refunds',
          none: true,
          view: false,
          viewEdit: true,
          admin: false,
        },
      },
      {
        manageReturns: {
          title: 'Manage Returns',
          none: true,
          view: false,
          viewEdit: true,
          admin: false,
        },
      },
    ],
  },
  {
    Vendors: [
      {
        manageVendors: {
          title: 'Manage Vendors',
          none: true,
          view: true,
          viewEdit: true,
          admin: true,
        },
      },
    ],
  },
  {
    Hunting: [
      {
        huntingForm: {
          title: 'Hunting Form',
          none: true,
          view: false,
          viewEdit: true,
          admin: false,
        },
      },
      {
        changeVendor: {
          title: 'Change Vendor',
          none: true,
          view: false,
          viewEdit: true,
          admin: false,
        },
      },
      {
        approveHuntedLists: {
          title: 'Approve Hunted Lists',
          none: true,
          view: false,
          viewEdit: true,
          admin: true,
        },
      },
    ],
  },
];

export default RadioMenuList;
