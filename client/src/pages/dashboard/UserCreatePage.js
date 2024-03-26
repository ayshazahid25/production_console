import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useState, Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';

// action
import { createUserRequest, clearMessage, clearError } from '../../actions/user';

// ----------------------------------------------------------------------

function UserCreatePage({
  Users: { message, error },
  Auth: { isAuthenticated },
  // eslint-disable-next-line
  createUserRequest,
  // eslint-disable-next-line
  clearMessage,
  // eslint-disable-next-line
  clearError,
}) {
  const navigate = useNavigate();

  const { themeStretch } = useSettingsContext();

  const [userData, setUserData] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATH_AUTH.login, { replace: true });
    }

    if (message) {
      enqueueSnackbar(message);

      setUserData(null);

      // clearMessage
      clearMessage();
    }
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      // clearError
      clearError();
    }

    // eslint-disable-next-line
  }, [isAuthenticated, message, error]);

  const handleSubmit = (user) => {
    setUserData(user);

    createUserRequest(user);
  };

  return (
    <>
      <Helmet>
        <title> User: Create a new user | Buggaz Ltd</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new user"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Users',
              href: PATH_DASHBOARD.user.root,
            },
            { name: 'New user' },
          ]}
        />
        <UserNewEditForm handleSubmited={handleSubmit} currentUser={userData} />
      </Container>
    </>
  );
}

UserCreatePage.propTypes = {
  Users: PropTypes.object.isRequired,
  Auth: PropTypes.object.isRequired,
  createUserRequest: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Users: state.Users,
  Auth: state.Auth,
});

export default connect(mapStateToProps, { createUserRequest, clearMessage, clearError })(
  UserCreatePage
);
