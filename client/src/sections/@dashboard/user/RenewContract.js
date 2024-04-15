import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useState } from 'react';
// form
import { Controller, useForm } from 'react-hook-form';
// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import moment from 'moment';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  useTheme,
  MenuItem,
  TextField,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { DesktopDatePicker, MobileDatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

function RenewContract({ lastContract }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [isDateDisabled, setIsDateDisabled] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const NewUserSchema = Yup.object().shape({
    employment_type: Yup.string()
      .oneOf(['permanent', 'probation', 'internship', 'contract'], 'Invalid employment type')
      .required('Employment type is required'),

    start_date: Yup.date().required('Start Date is required'),
    end_date: Yup.date().required('End Date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      employment_type: 'probation', // Default value is probation
      start_date: lastContract
        ? moment(lastContract.end_date).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'), // Default to today's date
      end_date: lastContract
        ? moment(lastContract.end_date).add(3, 'months').format('YYYY-MM-DD')
        : moment().add(3, 'months').format('YYYY-MM-DD'), // Default to today's date + 3 months
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);
  };

  const handleEmploymentTypeChange = (newValue) => {
    setValue('employment_type', newValue); // Set the value of employment type
    setIsDateDisabled(newValue === 'permanent'); // Set isDateDisabled based on the new value of employment type
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
        <DialogTitle>Renew-Contract</DialogTitle>
        <DialogContent>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ p: 2 }}>
              <RHFTextField
                name="employment_type"
                label="Employment Type *"
                select
                variant="outlined"
                onChange={(e) => handleEmploymentTypeChange(e.target.value)}
              >
                {employetypeArray.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFTextField>
            </Box>
            <Box sx={{ p: 2 }}>
              <Controller
                name="start_date"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <DesktopDatePicker
                    label="Start Date *"
                    value={value}
                    onChange={(date) => onChange(date)}
                    renderInput={(params) => (
                      <TextField
                        error={invalid}
                        helperText={invalid ? error.message : null}
                        id="start_date"
                        margin="dense"
                        fullWidth
                        color="primary"
                        {...params}
                      />
                    )}
                    inputFormat="yyyy-MM-dd"
                  />
                )}
              />
            </Box>
            <Box sx={{ p: 2 }}>
              <Controller
                name="end_date"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                  <DesktopDatePicker
                    label="End Date *"
                    value={value}
                    disabled={isDateDisabled}
                    minDate={getValues('start_date')}
                    onChange={(date) => onChange(date)}
                    renderInput={(params) => (
                      <TextField
                        error={invalid}
                        helperText={invalid ? error.message : null}
                        id="end_date"
                        margin="dense"
                        fullWidth
                        color="primary"
                        {...params}
                      />
                    )}
                    inputFormat="yyyy-MM-dd"
                  />
                )}
              />
            </Box>
            <DialogActions>
              <Button onClick={handleClose} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}

RenewContract.propTypes = {
  lastContract: PropTypes.object.isRequired,
};

export default connect(null, {})(RenewContract);
