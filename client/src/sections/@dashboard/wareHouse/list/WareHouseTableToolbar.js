import PropTypes from 'prop-types';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Stack, InputAdornment, TextField, Button } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// ----------------------------------------------------------------------

const WareHouseTableToolbar = memo(({ isFiltered, filterName, onFilterName, onResetFilter }) => (
  <Stack
    spacing={2}
    alignItems="center"
    direction={{
      xs: 'column',
      sm: 'row',
    }}
    sx={{ px: 2.5, py: 3 }}
  >
    <TextField
      fullWidth
      value={filterName}
      onChange={onFilterName}
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
    />

    {isFiltered && (
      <Button
        color="error"
        sx={{ flexShrink: 0 }}
        onClick={onResetFilter}
        startIcon={<Iconify icon="eva:trash-2-outline" />}
      >
        Clear
      </Button>
    )}

    {/* {user && user.permission_settings.user_create_view_and_edit && ( */}
    <Button
      color="primary"
      component={RouterLink}
      to={PATH_DASHBOARD.wareHouse.new}
      sx={{ flexShrink: 0 }}
      startIcon={<Iconify icon="eva:plus-fill" />}
    >
      Ware House
    </Button>
  </Stack>
));

WareHouseTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default WareHouseTableToolbar;
