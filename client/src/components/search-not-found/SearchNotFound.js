import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const SearchNotFound = memo(({ query, sx, ...other }) =>
  query ? (
    <Paper
      sx={{
        textAlign: 'center',
        ...sx,
      }}
      {...other}
    >
      <Typography variant="h6" paragraph>
        Not found
      </Typography>

      <Typography variant="body2">
        No results found for &nbsp;
        <strong>&quot;{query}&quot;</strong>.
        <br /> Try checking for typos or using complete words.
      </Typography>
    </Paper>
  ) : (
    <Typography variant="body2" sx={sx}>
      Please enter keywords
    </Typography>
  )
);
SearchNotFound.propTypes = {
  query: PropTypes.string,
  sx: PropTypes.object,
};

export default SearchNotFound;
