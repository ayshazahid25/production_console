import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { DesktopDatePicker } from '@mui/x-date-pickers';

//
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  IconButton,
  Button,
  InputAdornment,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material';
import moment from 'moment';

// components
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';

import FormProvider, { RHFTextField } from '../../../components/hook-form';
import ResetPasswordDialogs from '../../../components/user/ResetPasswordDialogs';

import { deleteUserRequest } from '../../../actions/user';
// ----------------------------------------------------------------------

function UserNewEditForm({
  Auth: { user },
  // eslint-disable-next-line
  deleteUserRequest,
  isEdit = false,
  isBannable = false,
  currentUser,
  handleSubmited,
  handleData,
}) {
  const NewUserSchema = !isEdit
    ? Yup.object().shape({
        title: Yup.string().required('Title is required'),
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        password: Yup.string().min(5).required('Password is required'),
        email: Yup.string()
          .required('Email is required')
          .email('Email must be a valid email address'),

        gender: Yup.mixed().oneOf(['male', 'female', 'other']).required('Gender is required'),
        phone_number: Yup.string()
          .nullable()
          .test('phone_number', 'Phone Number must be 11 character long.', (value) => {
            const pattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            return pattern.test(value) || value === '';
          }),
        address: Yup.string(),
        CNIC: Yup.string()
          .nullable()
          .test('CNIC', 'CNIC must be 13 character long.', (value) => {
            const pattern = /^(\d{13})$/;
            return pattern.test(value) || value === '';
          }),
        employment_type: Yup.string()
          .oneOf(['permanent', 'probation', 'internship', 'contract'], 'Invalid employment type')
          .required('Employment type is required'),

        start_date: Yup.date().required('Start Date is required'),
        end_date: Yup.date().required('End Date is required'),
      })
    : Yup.object().shape({
        title: Yup.string().min(3).required('Title is required'),
        first_name: Yup.string().min(3).required('First name is required'),
        last_name: Yup.string().min(3).required('Last name is required'),
        email: Yup.string()
          .required('Email is required')
          .email('Email must be a valid email address'),
        gender: Yup.mixed()
          .oneOf(['male', 'female', 'other'], 'Gender is required')
          .required('Gender is required'),
        phone_number: Yup.string()
          .nullable()
          .test('phone_number', 'Phone Number must be 11 character long.', (value) => {
            const pattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
            return pattern.test(value) || value === '';
          }),
        address: Yup.string(),
        CNIC: Yup.string()
          .nullable()
          .test('CNIC', 'CNIC must be 13 character long.', (value) => {
            const pattern = /^(\d{13})$/;
            return pattern.test(value) || value === '';
          }),
      });

  const defaultValues = useMemo(
    () => ({
      title: currentUser?.title || '',
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      password: currentUser?.password || '',
      gender: currentUser?.gender || '',
      phone_number: currentUser?.phone_number || '',
      address: currentUser?.address || '',
      CNIC: currentUser?.cnic || '',
      employment_type: currentUser?.employment_type || 'probation', // Default value is probation
      start_date: moment().format('YYYY-MM-DD'), // Default to today's date
      end_date: moment().add(3, 'months').format('YYYY-MM-DD'), // Default to today's date + 3 months
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
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

  const [showPassword, setShowPassword] = useState(false);
  const [onActive, setOnActive] = useState(currentUser?.is_active ? 'active' : 'banned');

  const [isDisable, setIsDisable] = useState(false);
  const [isDateDisabled, setIsDateDisabled] = useState(false);

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
      setOnActive(currentUser?.is_active ? 'active' : 'banned');
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));

      const userData = {
        title: data.title ? data.title : null,
        first_name: data.first_name ? data.first_name : null,
        last_name: data.last_name ? data.last_name : null,
        gender: data.gender ? data.gender : null,
        email: data.email ? data.email : null,
        phone_number: data.phone_number ? data.phone_number : null,
        address: data.address ? data.address : null,
        cnic: data.CNIC ? data.CNIC : null,
      };

      if (!isEdit) {
        userData.password = data.password;
        userData.employment_type = data.employment_type;
        userData.start_date = data.start_date.toISOString();
        userData.end_date =
          data.employment_type === 'permanent' ? null : data.end_date.toISOString();

        handleSubmited(userData);

        reset();
      } else {
        handleSubmited(userData);
      }

      setIsDisable(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = (is_active) => {
    setOnActive(is_active ? 'active' : 'banned');
    deleteUserRequest({
      userId: [currentUser._id],
      is_active,
      isEdit: true,
    });
  };

  // Reset Password
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmploymentTypeChange = (newValue) => {
    setValue('employment_type', newValue); // Set the value of employment type
    setIsDateDisabled(newValue === 'permanent'); // Set isDateDisabled based on the new value of employment type
  };

  const genderArray = [
    {
      value: 'male',
      label: 'Male',
    },
    {
      value: 'female',
      label: 'Female',
    },
  ];
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
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {isEdit && !isBannable && (
            <Grid item xs={12} md={4}>
              <Card sx={{ pt: 5, pb: 5, px: 3 }}>
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={onActive === 'active'}
                          disabled={!user.is_admin || isBannable}
                          onChange={(event) => onDelete(event.target.checked)}
                        />
                      )}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Status{'  '}
                        {isEdit && currentUser && !isBannable && (
                          <Label
                            color={
                              // eslint-disable-next-line no-nested-ternary
                              onActive === 'active' ? 'success' : 'error'
                            }
                            sx={{
                              textTransform: 'uppercase',
                            }}
                          >
                            {
                              // eslint-disable-next-line no-nested-ternary
                              onActive === 'active' ? 'Active' : 'Banned'
                            }
                          </Label>
                        )}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {
                          // eslint-disable-next-line no-nested-ternary
                          onActive === 'active'
                            ? 'Toggle to deactivate account.'
                            : 'Toggle to activate account.'
                        }
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                />

                <Stack alignItems="center">
                  <Button variant="soft" onClick={handleClickOpen}>
                    Reset Password
                  </Button>
                </Stack>
              </Card>
            </Grid>
          )}

          <Grid item xs={12} md={isEdit ? 8 : 12}>
            <Card sx={{ p: 3 }}>
              <Stack direction="row-reverse" alignItems="flex-end" sx={{ mb: 3 }}>
                {isBannable && (
                  <Button
                    sx={{ mr: 1 }}
                    disabled={isDisable}
                    onClick={() => setIsDisable(true)}
                    color="secondary"
                    variant="soft"
                  >
                    Edit
                  </Button>
                )}
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={4} sm={4}>
                  <RHFTextField name="title" disabled={isBannable && !isDisable} label="Title *" />
                </Grid>
                <Grid item xs={8} sm={4}>
                  <RHFTextField
                    name="first_name"
                    disabled={isBannable && !isDisable}
                    label="First Name *"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <RHFTextField
                    name="last_name"
                    disabled={isBannable && !isDisable}
                    label="Last Name *"
                  />
                </Grid>
                <Grid item xs={4} sm={4}>
                  <RHFTextField
                    // id="outlined-select-currency"
                    disabled={isBannable && !isDisable}
                    name="gender"
                    label="Gender *"
                    select
                    variant="outlined"
                  >
                    {genderArray.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFTextField>
                </Grid>
                <Grid item xs={8} sm={4}>
                  <RHFTextField
                    name="email"
                    disabled={isBannable && !isDisable}
                    label="Email Address *"
                  />
                </Grid>
                {!isEdit && (
                  <Grid item xs={12} sm={4}>
                    <RHFTextField
                      name="password"
                      label="Password *"
                      type={showPassword ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}
                {!isBannable && (
                  <Grid item xs={12} sm={4}>
                    <RHFTextField
                      name="phone_number"
                      disabled={isBannable && !isDisable}
                      label="Phone Number"
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm={isEdit ? 6 : 4}>
                  <RHFTextField
                    name="CNIC"
                    disabled={isBannable && !isDisable}
                    label="CNIC Number"
                  />
                </Grid>
                <Grid item xs={12} sm={isEdit ? 6 : 4}>
                  <RHFTextField
                    name="address"
                    disabled={isBannable && !isDisable}
                    label="Address"
                  />
                </Grid>
              </Grid>

              <Divider variant="middle" sx={{ mt: 2, mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  {!isEdit && (
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
                  )}
                </Grid>

                <Grid item xs={12} sm={4}>
                  <DesktopDatePicker
                    label="Start Date *"
                    value={getValues('start_date')}
                    onChange={(date) => setValue('start_date', date, { shouldValidate: true })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    inputFormat="MM/dd/yyyy"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <DesktopDatePicker
                    label="End Date *"
                    disabled={isDateDisabled} // Disable if employment type is permanent
                    value={getValues('end_date')}
                    minDate={getValues('start_date')}
                    onChange={(date) => setValue('end_date', date, { shouldValidate: true })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    inputFormat="MM/dd/yyyy"
                  />
                </Grid>
              </Grid>

              <Divider variant="middle" sx={{ mt: 2, mb: 2 }} />

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  disabled={isBannable && !isDisable}
                  variant="soft"
                  loading={isSubmitting}
                >
                  {!isEdit ? 'Next' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <ResetPasswordDialogs
        open={open}
        handleClose={handleClose}
        userId={currentUser ? currentUser.id : ''}
      />
    </>
  );
}

UserNewEditForm.propTypes = {
  Auth: PropTypes.object.isRequired,
  deleteUserRequest: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  isBannable: PropTypes.bool,
  currentUser: PropTypes.object,
  handleSubmited: PropTypes.func,
  handleData: PropTypes.func,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, { deleteUserRequest })(UserNewEditForm);
