import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
// utils
import { fData } from '../../../utils/formatNumber';
// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';

// components
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';

import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
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
  console.log('currentUser::, ', currentUser);
  // const navigate = useNavigate();

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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    // register,
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
        CNIC: data.CNIC ? data.CNIC : null,
      };

      if (!isEdit) {
        userData.password = data.password;
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

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ pt: 5, pb: 5, px: 3 }}>
              {isEdit && !isBannable && (
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
                              // position: 'absolute',
                              // top: 24,
                              // right: 24,
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
              )}

              {isEdit && !isBannable && (
                <Stack alignItems="center">
                  <Button variant="soft" onClick={handleClickOpen}>
                    Reset Password
                  </Button>
                </Stack>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
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
                <Grid item xs={4} sm={isEdit ? 4 : 2}>
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

                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="CNIC"
                    disabled={isBannable && !isDisable}
                    label="CNIC Number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField
                    name="address"
                    disabled={isBannable && !isDisable}
                    label="Address"
                  />
                </Grid>
              </Grid>

              {/* 
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="joined_at"
                  control={control}
                  defaultValue={null}
                  render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                    <DesktopDatePicker
                      label="Joining Date *"
                      disableFuture
                      disabled={isBannable}
                      value={value}
                      onChange={(date) => onChange(moment(date).format('YYYY-MM-DD'))}
                      renderInput={(params) => (
                        <TextField
                          error={invalid}
                          helperText={invalid ? error.message : null}
                          id="joined_at"
                          margin="none"
                          fullWidth
                          color="primary"
                          {...params}
                        />
                      )}
                    />
                  )}
                />
              </Grid>
              {!isBannable && (
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="released_date"
                    control={control}
                    defaultValue={null}
                    render={({ field: { onChange, value }, fieldState: { error, invalid } }) => (
                      <DesktopDatePicker
                        label="Released"
                        disableFuture
                        disabled={isBannable && !isDisable}
                        value={value}
                        onChange={(date) => onChange(moment(date).format('YYYY-MM-DD'))}
                        renderInput={(params) => (
                          <TextField
                            error={invalid}
                            helperText={invalid ? error.message : null}
                            id="released_date"
                            margin="none"
                            fullWidth
                            color="primary"
                            {...params}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              )} */}
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
