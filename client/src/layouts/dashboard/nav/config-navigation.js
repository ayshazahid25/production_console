// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  other: icon('ic_folder'),
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  category: icon('ic_label'),
  vendor: icon('ic_cart'),
  chat: icon('ic_chat'),
  banking: icon('ic_banking'),
  invoice: icon('ic_invoice'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      {
        title: 'Home',
        path: PATH_DASHBOARD.home,
        icon: ICONS.dashboard,
      },
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        role: 'is_admin',
        children: [
          { title: 'list', path: PATH_DASHBOARD.user.list, role: 'is_admin' },
          { title: 'new', path: PATH_DASHBOARD.user.new, role: 'is_admin' },
        ],
      },
    ],
  },
  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'category',
        path: PATH_DASHBOARD.category,
        icon: ICONS.category,
        role: 'is_admin',
      },
      {
        title: 'create',
        path: PATH_DASHBOARD.create,
        icon: ICONS.user,
        role: 'is_admin',
      },
      {
        title: 'car',
        path: PATH_DASHBOARD.car,
        icon: ICONS.user,
      },
    ],
  },
];

export default navConfig;
