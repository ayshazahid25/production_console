import PropTypes from 'prop-types';

const FormatPermissionData = (data) => ({
  // ********* Settings *************
  // dashboard
  dashboard_view: data.dashboard === 'view' || data.dashboard === 'viewEdit',
  dashboard_view_and_edit: data.dashboard === 'viewEdit',
  // usersPermissions
  user_view:
    data.usersPermissions === 'view' ||
    data.usersPermissions === 'viewEdit' ||
    data.usersPermissions === 'admin',
  user_view_and_edit: data.usersPermissions === 'viewEdit' || data.usersPermissions === 'admin',
  user_create_view_and_edit: data.usersPermissions === 'admin',
  // ********* Inventory *************
  // Manage Inventory/Add a Product
  manage_inventory_view_and_edit: data.manageInventoryOrAddAProduct === 'viewEdit',
  // Manage FBA Inventory/Shipments
  manage_fba_inventory_view_and_edit: data.manageFBAInventoryShipments === 'viewEdit',
  // Manage Categories
  category_view:
    data.manageCategories === 'view' ||
    data.manageCategories === 'viewEdit' ||
    data.manageCategories === 'admin',
  category_view_and_edit: data.manageCategories === 'viewEdit' || data.manageCategories === 'admin',
  category_create_view_and_edit: data.manageCategories === 'admin',
  // marketplace
  marketplace_view:
    data.marketplaces === 'view' ||
    data.marketplaces === 'viewEdit' ||
    data.marketplaces === 'admin',
  marketplace_view_and_edit: data.marketplaces === 'viewEdit' || data.marketplaces === 'admin',
  marketplace_create_view_and_edit: data.marketplaces === 'admin',
  // ********* Orders *************
  // Manage Orders
  manage_orders_view:
    data.manageOrders === 'view' ||
    data.manageOrders === 'viewEdit' ||
    data.manageOrders === 'admin',
  manage_orders_view_and_edit: data.manageOrders === 'viewEdit' || data.manageOrders === 'admin',
  manage_orders_create_view_and_edit: data.manageOrders === 'admin',

  // Manage Refunds
  manage_refunds_view_and_edit: data.manageRefunds === 'viewEdit',
  // Manage Returns
  manage_returns_view_and_edit: data.manageReturns === 'viewEdit',
  // ********* Vendors *************
  // Manage Vendors
  manage_vendors_view:
    data.manageVendors === 'view' ||
    data.manageVendors === 'viewEdit' ||
    data.manageVendors === 'admin',
  manage_vendors_view_and_edit: data.manageVendors === 'viewEdit' || data.manageVendors === 'admin',
  manage_vendors_create_view_and_edit: data.manageVendors === 'admin',
  // ********* Hunting *************
  // Hunting Form
  hunting_form_view_and_edit: data.huntingForm === 'viewEdit',
  // Change Vendor
  change_vendor_view_and_edit: data.changeVendor === 'viewEdit',
  // Approve Hunted Lists
  approve_hunting_list_view_and_edit:
    data.approveHuntedLists === 'viewEdit' || data.approveHuntedLists === 'admin',
  approve_hunting_list_create_view_and_edit: data.approveHuntedLists === 'admin',
});

FormatPermissionData.propTypes = {
  data: PropTypes.object,
};

export default FormatPermissionData;
