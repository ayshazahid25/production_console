import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Button, Grid, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers';
import { getReportOfRemainingWorkingHoursOfMonthByDaysRequest } from '../../../../actions/report';
import formatDate from '../../../../utils/formateMonthAndYear';

function PickerMonth({ getRemainingWorkingHoursOfMonth }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleButtonClick = () => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      getRemainingWorkingHoursOfMonth({ specificMonth: formattedDate });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' }, // Set flexDirection column for xs and row for sm and up
          // alignItems: { xs: 'center' }, // Center align items for xs
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            marginTop: { sm: 2 }, // Set marginBottom only for xs
            textAlign: { xs: 'center', sm: 'initial' }, // Center text for xs and left align for sm and up
          }}
        >
          <span>Monthly Report</span>
        </Box>

        <Box>
          <DesktopDatePicker
            label="For desktop"
            value={selectedDate}
            onChange={handleDateChange}
            maxDate={new Date()} // Limit to the current date
            views={['month', 'year']}
            openTo="month"
            renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
          />
          <Button
            variant="contained"
            onClick={handleButtonClick}
            sx={{ float: { xs: 'center', sm: 'inline-end' } }}
          >
            Get Report
          </Button>
        </Box>
      </Box>
    </>
  );
}
PickerMonth.propTypes = {
  getRemainingWorkingHoursOfMonth: PropTypes.func.isRequired,
};

export default connect(null, {
  getRemainingWorkingHoursOfMonth: getReportOfRemainingWorkingHoursOfMonthByDaysRequest,
})(PickerMonth);
