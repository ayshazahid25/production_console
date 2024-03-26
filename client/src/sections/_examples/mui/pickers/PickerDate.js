import { TextField } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import React, { useState } from 'react';

export const PickerDate = () => {
  const [value, setValue] = useState(new Date());

  const handleDateChange = (date) => {
    setValue(date);
  };
  return (
    <>
      <MobileDatePicker
        orientation="portrait"
        label="For mobile"
        value={value}
        onChange={handleDateChange}
        // onChange={(newValue) => {
        //   setValue(newValue);
        // }}
        renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
      />
    </>
  );
};
