import PropTypes from 'prop-types';
// @mui
import { Stack, TableRow, TableCell, Typography } from '@mui/material';
import moment from 'moment';

// ----------------------------------------------------------------------

const ContractTableRow = ({ row }) => {
  const { employment_type, start_date, end_date } = row;

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack direction="row" alignItems="left" spacing={2}>
            <Typography variant="subtitle2" noWrap sx={{ textTransform: 'capitalize' }}>
              {employment_type}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {moment(start_date).format('YYYY-MM-DD')}
        </TableCell>
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {end_date ? moment(end_date).format('YYYY-MM-DD') : '---'}
        </TableCell>
      </TableRow>
    </>
  );
};

ContractTableRow.propTypes = {
  row: PropTypes.object,
};

export default ContractTableRow;
