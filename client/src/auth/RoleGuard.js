import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PermissionDeniedPage from '../pages/dashboard/PermissionDeniedPage';
// ----------------------------------------------------------------------

function RoleGuard({ Auth: { user }, children }) {
  return user.is_admin ? <> {children} </> : <PermissionDeniedPage />;
}

RoleGuard.propTypes = {
  children: PropTypes.node,
  Auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(RoleGuard);
