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
} from '@mui/material';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider from '../../../components/hook-form';
import Iconify from '../../../components/iconify';
import PickerDateTime from '../../_examples/mui/pickers/PickerDateTime';
import { recordCheckInRequest, clearMessage, clearError } from '../../../actions/report';
// ----------------------------------------------------------------------

function CheckInCheckOutDialog({
  Reports: { message, error },
  // eslint-disable-next-line
  recordCheckInRequest,
  // eslint-disable-next-line
  clearMessage,
  // eslint-disable-next-line
  clearError,
  lastCheckIn,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (message) {
      enqueueSnackbar(message);
      handleClose();
      clearMessage();
    }
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      handleClose();
      // clearError
      clearError();
    }

    // eslint-disable-next-line
  }, [message, error]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const minDateTimeValue = new Date(
    lastCheckIn.check_out_time ? lastCheckIn.check_out_time : lastCheckIn.check_in_time
  );

  const defaultTimeValue = useMemo(() => new Date(), []);

  const methods = useForm({
    defaultValues: {
      time: defaultTimeValue,
    },
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = async (data) => {
    const actionKey = lastCheckIn.check_out_time ? 'check_in_time' : 'check_out_time';

    const checkTimeData = {
      [actionKey]: data.time.toISOString(),
    };

    recordCheckInRequest(checkTimeData);
  };

  return (
    <>
      <Button
        sx={{ float: isSmallScreen ? 'left' : 'right' }}
        variant="soft"
        onClick={handleClickOpen}
        startIcon={
          <Iconify
            icon={lastCheckIn.check_out_time ? 'majesticons:login-line' : 'majesticons:logout-line'}
          />
        }
      >
        {lastCheckIn.check_out_time ? 'Check-In' : 'Check-Out'}
      </Button>

      <Dialog fullWidth open={open} onClose={handleClose}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{lastCheckIn.check_out_time ? 'Check-In' : 'Check-Out'}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <PickerDateTime
                minDateTimeValue={minDateTimeValue}
                value={defaultTimeValue}
                onTimeChange={(newTime) => methods.setValue('time', newTime)}
              />
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

CheckInCheckOutDialog.propTypes = {
  Reports: PropTypes.object.isRequired,
  recordCheckInRequest: PropTypes.func.isRequired,
  clearMessage: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  lastCheckIn: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  Reports: state.Reports,
});

export default connect(mapStateToProps, {
  recordCheckInRequest,
  clearMessage,
  clearError,
})(CheckInCheckOutDialog);
