import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// components
import LoadingScreen from '../components/loading-screen';

import Login from '../pages/LoginPage';

import { getUserRequest } from '../actions/auth';

// ----------------------------------------------------------------------

function AuthGuard({ children, Auth: { isAuthenticated, isInitialized, token }, getUser }) {
  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  useEffect(() => {
    if (token) {
      getUser(token);
    }
    // eslint-disable-next-line
  }, [pathname, token]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <> {children} </>;
}

AuthGuard.propTypes = {
  Auth: PropTypes.object.isRequired,
  children: PropTypes.node,
  getUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, { getUser: getUserRequest })(AuthGuard);
