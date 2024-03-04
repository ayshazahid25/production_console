import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
// components
import LoadingScreen from '../components/loading-screen';
//
// import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

function GuestGuard({ children, Auth: { isAuthenticated, isInitialized } }) {
  // const { isAuthenticated, isInitialized } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}

GuestGuard.propTypes = {
  Auth: PropTypes.object.isRequired,
  children: PropTypes.node,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(GuestGuard);
