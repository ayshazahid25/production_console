import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useTheme,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import Iconify from '../../../components/iconify';
import PickerDateTime from '../../_examples/mui/pickers/PickerDateTime';
import { recordCheckInRequest, clearMessage, clearError } from '../../../actions/report';

// ----------------------------------------------------------------------

function RenewContract() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const defaultTimeValue = useMemo(() => new Date(), []);

  const methods = useForm({
    defaultValues: {
      time: defaultTimeValue,
    },
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = async (data) => {
    console.log(data);
  };

  const employetypeArray = [
    {
      value: 'permanent',
      label: 'Permanent',
    },
    {
      value: 'probation',
      label: 'Probation',
    },
    {
      value: 'internship',
      label: 'Internship',
    },
    {
      value: 'contract',
      label: 'Contract',
    },
  ];
  return (
    <>
      <Button
        sx={{ float: isSmallScreen ? 'left' : 'right' }}
        variant="soft"
        onClick={handleClickOpen}
      >
        RenewContract
      </Button>

      <Dialog fullWidth open={open} onClose={handleClose}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Renew-Contract</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="employment_type"
                    label="Employment Type *"
                    select
                    variant="outlined"
                  >
                    {employetypeArray.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* <PickerDate /> */}
                  <MobileDatePicker
                    orientation="portrait"
                    label="Start Date"
                    // value={valuedate}
                    // onChange={handleDateChange}
                    // onChange={(newValue) => {
                    //   setValue(newValue);
                    // }}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MobileDatePicker
                    orientation="portrait"
                    label="End Date"
                    // value={valuedate}
                    // onChange={handleDateChange}
                    // onChange={(newValue) => {
                    //   setValue(newValue);
                    // }}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}

export default RenewContract;
