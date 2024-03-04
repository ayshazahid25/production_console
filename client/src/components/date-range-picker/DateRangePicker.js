import PropTypes from 'prop-types';
// @mui
import { Stack, Button, TextField, FormHelperText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// hooks
import useResponsive from '../../hooks/useResponsive';

import { convertLocalToUTCDate } from './useDateRangePicker';

// ----------------------------------------------------------------------

DateRangePicker.propTypes = {
  isError: PropTypes.bool,
  onApply: PropTypes.func,
  onChangeEndDate: PropTypes.func,
  onChangeStartDate: PropTypes.func,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
  matches: PropTypes.bool,
};

export default function DateRangePicker({
  startDate,
  endDate,
  //
  onChangeStartDate,
  onChangeEndDate,
  //

  onApply,
  //
  isError,
}) {
  const isDesktop = useResponsive('up', 'md');

  return (
    <>
      <Stack
        spacing={1}
        direction="column"
        // justifyContent="center"
        sx={{
          '& .MuiCalendarPicker-root': {
            ...(!isDesktop && {
              width: 'auto',
            }),
          },
        }}
      >
        <DatePicker
          label="From"
          inputFormat="dd/MM/yyyy"
          value={startDate}
          onChange={(date) => onChangeStartDate(convertLocalToUTCDate(date))}
          renderInput={(params) => <TextField {...params} size="small" />}
        />

        <DatePicker
          label="To"
          inputFormat="dd/MM/yyyy"
          value={endDate}
          onChange={(date) => onChangeEndDate(convertLocalToUTCDate(date))}
          renderInput={(params) => <TextField {...params} size="small" />}
        />

        {isError && (
          <FormHelperText error sx={{ px: 2 }}>
            End date must be later than start date
          </FormHelperText>
        )}
      </Stack>
      <Stack justifyContent="end" direction="row" sx={{ mt: 1.5 }}>
        <Button disabled={isError} variant="soft" onClick={onApply}>
          Apply
        </Button>
      </Stack>
    </>
  );
}
