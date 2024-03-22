// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,

  home: path(ROOTS_DASHBOARD, 'home'),

  category: path(ROOTS_DASHBOARD, 'category'),

  create: path(ROOTS_DASHBOARD, 'create'),

  car: path(ROOTS_DASHBOARD, 'car'),

  user: {
    root: path(ROOTS_DASHBOARD, 'user'),
    list: path(ROOTS_DASHBOARD, 'user/list'),
    new: path(ROOTS_DASHBOARD, 'user/new'),
    account: (id) => path(ROOTS_DASHBOARD, `user/account/${id}`),
  },
};
