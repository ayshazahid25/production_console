import PropTypes from 'prop-types';

import { memo } from 'react';
// @mui
import { Stack, TextField, MenuItem } from '@mui/material';
// components
// import Iconify from '../../../../components/iconify';

import DateRangePicker from '../../../../components/date-range-picker';
import { UploadBox } from '../../../../components/upload';
// ----------------------------------------------------------------------

const OrderDateRange = memo(
  ({ optionForDateRange, pickerInput, dateRange, handleDateRange, onApplyDate, small }) => {
    const fileReader = new FileReader();

    const onDrop = (acceptedFiles) => {
      // setFile(e.target.files[0]);
      // e.preventDefault();

      const file = acceptedFiles[0];

      if (file) {
        fileReader.onload = (event) => {
          const text = event.target.result;
          const array = csvFileToArray(text);
          console.log('array', array);
        };

        fileReader.readAsText(file);
      }
      console.log(fileReader);
    };

    const csvFileToArray = (string) => {
      const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
      const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

      const settingArray = csvRows.map((i) => {
        const values = i.split(',');
        const obj = csvHeader.reduce((object, header, index) => {
          object[header] = values[index];
          return object;
        }, {});
        return obj;
      });

      return settingArray;
    };

    return (
      <Stack
        spacing={2}
        alignItems="flex-end"
        direction={small ? 'row-reverse' : 'column-reverse'}
        // direction={{
        //   xs: 'column-reverse',
        //   sm: 'column-reverse',

        //   // sm: 'row-reverse',
        //   md: 'row-reverse',
        // }}
        sx={{ px: 2.5, pb: 3, pt: small ? 0 : 3 }}
      >
        {/* <IconButton color="primary" component="label" sx={{ pt: 0 }}>
          <input accept=".csv" type="file" onChange={handleOnChange} />

          <Iconify sx={{ width: '26px', height: '26px' }} icon="bi:filetype-csv" />
        </IconButton> */}

        <UploadBox onDrop={onDrop} accept={{ 'text/csv': ['.csv'] }} />

        {dateRange === 'custom' && (
          <DateRangePicker
            open={pickerInput.open}
            startDate={pickerInput.startDate}
            endDate={pickerInput.endDate}
            onChangeStartDate={pickerInput.onChangeStartDate}
            onChangeEndDate={pickerInput.onChangeEndDate}
            onClose={pickerInput.onClose}
            onApply={() => onApplyDate()}
            isError={pickerInput.isError}
          />
        )}

        <TextField
          fullWidth
          select
          name="DateTime"
          value={dateRange}
          onChange={handleDateRange}
          size="small"
          SelectProps={{
            MenuProps: {
              PaperProps: {
                sx: {
                  maxHeight: 260,
                },
              },
            },
          }}
          sx={{
            maxWidth: (small && 240) || 'auto',
            textTransform: 'capitalize',
          }}
        >
          {optionForDateRange.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                mx: 1,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    );
  }
);

OrderDateRange.propTypes = {
  handleDateRange: PropTypes.func,
  dateRange: PropTypes.string,
  onApplyDate: PropTypes.func,
  pickerInput: PropTypes.object,
  optionForDateRange: PropTypes.arrayOf(PropTypes.object),
  small: PropTypes.bool,
};

export default OrderDateRange;
