import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
import RoleGuard from '../auth/RoleGuard';

// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  Page404,
  DashboardPage,
  LoginPage,
  CategoryListPage,
  CarListPage,
  UserCreatePage,
  UserListPage,
  UserAccountPage,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },

        {
          path: 'home',
          element: <DashboardPage />,
        },
        {
          path: 'category',
          element: (
            <RoleGuard>
              <CategoryListPage />
            </RoleGuard>
          ),
        },

        {
          path: 'car',
          element: <CarListPage />,
        },

        /* User */
        {
          path: 'user',
          children: [
            { element: <Navigate to="/user/list" replace />, index: true },
            {
              path: 'list',
              element: (
                <RoleGuard permission="userplace_view">
                  <UserListPage />
                </RoleGuard>
              ),
            },
            {
              path: 'new',
              element: (
                <RoleGuard permission="userplace_create_view_and_edit">
                  <UserCreatePage />
                </RoleGuard>
              ),
            },
            {
              path: 'account/:id',
              element: (
                <RoleGuard permission="userplace_create_view_and_edit">
                  <UserAccountPage />
                </RoleGuard>
              ),
            },
          ],
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
