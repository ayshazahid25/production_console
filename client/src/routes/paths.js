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

  car: path(ROOTS_DASHBOARD, 'car'),
};
