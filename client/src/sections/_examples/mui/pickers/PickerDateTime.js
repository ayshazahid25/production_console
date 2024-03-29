import { useEffect, useState } from 'react';
// @mui
import { TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

function PickerDateTime({ minDateTimeValue, value, onTimeChange }) {
  const [internalValue, setInternalValue] = useState(value);

  const handleTimeChange = (newValue) => {
    setInternalValue(newValue);
    // Pass the selected time to the parent component
    onTimeChange(newValue);
  };

  useEffect(() => {
    // Update internal value when the parent changes the initial time
    setInternalValue(value);
  }, [value]);

  return (
    <MobileDateTimePicker
      value={internalValue}
      onChange={handleTimeChange}
      maxDateTime={value}
      minDateTime={minDateTimeValue}
      renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
    />
  );
}

PickerDateTime.propTypes = {
  minDateTimeValue: PropTypes.instanceOf(Date).isRequired,
  value: PropTypes.instanceOf(Date).isRequired,
  onTimeChange: PropTypes.func.isRequired,
};

export default PickerDateTime;
