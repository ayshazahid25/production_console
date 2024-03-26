import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import { Container, Tab, Tabs, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// components

import { useSnackbar } from '../../components/snackbar';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
// import UserPermissionSettings from '../../sections/@dashboard/user/UserPermissionSettings';

// action

import {
  getUserByIdRequest,
  updateUserRequest,
  updatePermissionRequest,
  clearUser,
  clearMessage,
  clearError,
} from '../../actions/user';
import UserContractHistory from '../../sections/@dashboard/user/UserContractHistory';

// ----------------------------------------------------------------------

function UserAccountPage({
  Users: { user, message, error },
  Auth: { isAuthenticated },
  // eslint-disable-next-line
  getUserByIdRequest,
  // eslint-disable-next-line
  updateUserRequest,
  // eslint-disable-next-line
  updatePermissionRequest,
  // eslint-disable-next-line
  clearUser,
  // eslint-disable-next-line
  clearMessage,
  // eslint-disable-next-line
  clearError,
}) {
  const navigate = useNavigate();

  const location = useLocation();

  const [userData, setUserData] = useState(null);
  const [permissionSettings, setPermissionSettings] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user && !error) {
      getUserByIdRequest(location.pathname.split('/').slice(-1));
    }

    if (!isAuthenticated) {
      navigate(PATH_AUTH.login, { replace: true });
    }

    if (message) {
      enqueueSnackbar(message);
      // clearMessage
      clearMessage();
    }
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      // clearError
      if (error !== "User don't exist") clearError();
    }

    // eslint-disable-next-line
  }, [isAuthenticated, message, error]);

  useEffect(
    () => () => clearUser(),
    // eslint-disable-next-line
    []
  );

  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('general');

  const submitUser = (data) => {
    setUserData(data);
    updateUserRequest(user?.id, data);
  };
  //
  const submitPermission = (permissionData) => {
    // setPermissionSettings(permissionData);
    // updatePermissionRequest(user?.id, permissionData);
  };

  const TABS = [
    {
      value: 'general',
      label: 'General',
      icon: <Iconify icon="ic:round-account-box" />,
      component: (
        <UserNewEditForm isEdit handleSubmited={submitUser} currentUser={user || userData} />
      ),
    },
    {
      value: 'permissionSettings',
      label: 'Contract History',
      icon: <Iconify icon="ic:round-receipt" />,
      component: (
        <UserContractHistory
          // isEdit
          // handleSubmited={submitPermission}
          // currentPermission={permissionSettings || user?.permission_settings || null}
          currentUser={user}
        />
      ),
      // component: (
      //   <UserPermissionSettings
      //     isEdit
      //     handleSubmited={submitPermission}
      //     currentPermission={permissionSettings || user?.permission_settings || null}
      //     currentUser={userData || user}
      //   />
      // ),
    },
  ];

  return (
    <>
      <Helmet>
        <title> User: Account Settings | Buggaz Ltd</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={
            user &&
            (!userData
              ? `${user.first_name} ${user.last_name}`
              : `${userData.first_name} ${userData.last_name}`)
          }
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Users', href: PATH_DASHBOARD.user.root },
            { name: 'User Details' },
          ]}
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}

UserAccountPage.propTypes = {
  Users: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  getUserByIdRequest: PropTypes.func.isRequired,
  updateUserRequest: PropTypes.func.isRequired,
  updatePermissionRequest: PropTypes.func.isRequired,
  clearUser: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Users: state.Users,
  Auth: state.Auth,
});

export default connect(mapStateToProps, {
  getUserByIdRequest,
  updateUserRequest,
  updatePermissionRequest,
  clearUser,
  clearMessage,
  clearError,
})(UserAccountPage);
