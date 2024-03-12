import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';

const PickerTime = React.memo(({ value, onTimeChange }) => {
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
    <TimePicker
      ampm={false}
      label="24 hours"
      value={internalValue}
      onChange={handleTimeChange}
      renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
      maxTime={value}
    />
  );
});

PickerTime.propTypes = {
  value: PropTypes.instanceOf(Date).isRequired,
  onTimeChange: PropTypes.func.isRequired,
};

export default PickerTime;
