import PropTypes from 'prop-types';

import { memo } from 'react';
// @mui
import { Box, Switch, TablePagination, FormControlLabel } from '@mui/material';

// ----------------------------------------------------------------------

const TablePaginationCustom = memo(
  ({ dense, onChangeDense, rowsPerPageOptions = [5, 10, 25], filters, sx, ...other }) => (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination rowsPerPageOptions={rowsPerPageOptions} component="div" {...other} />

      {filters}

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          name="dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              md: 'absolute',
            },
          }}
        />
      )}
    </Box>
  )
);

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
  filters: PropTypes.node,
};

export default TablePaginationCustom;
