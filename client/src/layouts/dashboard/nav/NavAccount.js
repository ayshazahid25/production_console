import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startCase } from 'lodash';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// components
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

function NavAccount({ Auth: { user } }) {
  return (
    <StyledRoot>
      <CustomAvatar src="" alt={user.first_name} name={user.first_name} />

      <Box sx={{ ml: 2, minWidth: 0 }}>
        <Typography variant="subtitle2" noWrap>
          {`${startCase(user?.first_name)} ${startCase(user?.last_name)}`}
        </Typography>
      </Box>
    </StyledRoot>
  );
}

NavAccount.propTypes = {
  Auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(NavAccount);
