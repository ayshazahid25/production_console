import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));

export const DashboardPage = Loadable(lazy(() => import('../pages/dashboard/DashboardPage')));

export const CategoryListPage = Loadable(lazy(() => import('../pages/category/CategoryListPage')));

export const CarListPage = Loadable(lazy(() => import('../pages/car/CarListPage')));

// Dashboard User
export const UserListPage = Loadable(lazy(() => import('../pages/dashboard/UserListPage')));

export const UserCreatePage = Loadable(lazy(() => import('../pages/dashboard/UserCreatePage')));
export const UserAccountPage = Loadable(lazy(() => import('../pages/dashboard/UserAccountPage')));

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
