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

import { deleteUserRequest } from '../../../actions/users';
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
  // const navigate = useNavigate();

  const NewUserSchema = !isEdit
    ? Yup.object().shape({
        title: Yup.mixed().oneOf(['Mr', 'Ms', 'Mrs']).required('Title is required'),
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        password: Yup.string().min(5).required('Password is required'),
        email: Yup.string()
          .required('Email is required')
          .email('Email must be a valid email address'),
        // billing_rate: Yup.number().required('Billing Rate is required'),
        billing_rate: Yup.number(),
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
        user_working_history_user_id: Yup.array().of(
          Yup.object().shape({
            joined_at: Yup.date(),
            released_date: Yup.date().nullable(),
          })
        ),
        // joined_at: Yup.date(),
        // released_date: Yup.date().nullable(),
        avatarUrl: Yup.string().nullable(true),
      })
    : Yup.object().shape({
        title: Yup.mixed()
          .oneOf(['Mr', 'Ms', 'Mrs'], 'Title is required')
          .required('Title is required'),
        first_name: Yup.string().min(3).required('First name is required'),
        last_name: Yup.string().min(3).required('Last name is required'),
        email: Yup.string()
          .required('Email is required')
          .email('Email must be a valid email address'),
        billing_rate: Yup.number(),
        // .required('Billing Rate is required'),
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
        user_working_history_user_id: Yup.array().of(
          Yup.object().shape({
            joined_at: Yup.date(),
            released_date: Yup.date().nullable(),
          })
        ),

        // joined_at: Yup.date(),
        // released_date: Yup.date().nullable(),
        avatarUrl: Yup.string().nullable(true),
      });

  // title
  // billing_rate
  //   released_date
  const defaultValues = useMemo(
    () => ({
      title: currentUser?.title || '',
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      password: currentUser?.password || '',
      billing_rate: currentUser?.billing_rate || 0,
      gender: currentUser?.gender || '',
      phone_number: currentUser?.phone_number || '',
      address: currentUser?.address || '',
      CNIC: currentUser?.CNIC || '',
      user_working_history_user_id: currentUser?.user_working_history_user_id || [
        { joined_at: moment(new Date()).format('YYYY-MM-DD'), released_date: null },
      ],
      // joined_at: currentUser?.joined_at || moment(new Date()).format('YYYY-MM-DD'),
      // released_date: currentUser?.released_date || null,
      avatarUrl: currentUser?.user_has_profile_pic?.file_data || currentUser?.avatarUrl || null,
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'user_working_history_user_id',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [onActive, setOnActive] = useState('active');
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
      setOnActive(currentUser.status);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // avatarUrl

      const image = typeof getValues('avatarUrl') === 'object' ? getValues('avatarUrl') : null;

      // navigate(PATH_DASHBOARD.users.list);
      const userData = {
        title: data.title ? data.title : null,
        first_name: data.first_name ? data.first_name : null,
        last_name: data.last_name ? data.last_name : null,
        gender: data.gender ? data.gender : null,
        email: data.email ? data.email : null,
        phone_number: data.phone_number ? data.phone_number : null,
        billing_rate: data.billing_rate ? data.billing_rate : 0,
        address: data.address ? data.address : null,
        CNIC: data.CNIC ? data.CNIC : null,
        avatarUrl: image,
        // user_working_history_user_id
        // : data.user_working_history_user_id
        //  ? data.user_working_history_user_id
        //  : null,
        // joined_at: moment(data.69).format('YYYY-MM-DD'),
        // released_date: data.released_date ? moment(data.released_date).format('YYYY-MM-DD') : null,
        // status: data.released_date ? 'leave' : currentUser.status,
      };

      const dates = data.user_working_history_user_id.map((d) => ({
        joined_at: moment(d.joined_at).format('YYYY-MM-DD'),
        released_date: d.released_date ? moment(d.released_date).format('YYYY-MM-DD') : null,
      }));

      userData.user_working_history_user_id = dates;

      const datesLength = data.user_working_history_user_id.length;

      if (
        data.user_working_history_user_id.length &&
        data.user_working_history_user_id[datesLength - 1].released_date
      )
        setOnActive('leave');
      // else setOnActive('active');

      // userData.status = data.user_working_history_user_id[datesLength - 1].released_date
      //   ? 'leave'
      //   : onActive;

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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile);
        // setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onDelete = (status) => {
    setOnActive(status);
    deleteUserRequest({
      userId: [currentUser.id],
      status,
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

  const titleArray = [
    {
      value: 'Mr',
      label: 'Mr.',
    },
    {
      value: 'Ms',
      label: 'Ms.',
    },
    {
      value: 'Mrs',
      label: 'Mrs.',
    },
  ];
  const genderArray = [
    {
      value: 'male',
      label: 'Male',
    },
    {
      value: 'female',
      label: 'Female',
    },
    {
      value: 'other',
      label: 'Other',
    },
  ];

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                {onActive === 'leave' && (
                  <Label
                    color="warning"
                    sx={{
                      textTransform: 'uppercase',
                      position: 'absolute',
                      top: 24,
                      right: 24,
                    }}
                  >
                    Leave
                  </Label>
                )}
                <RHFUploadAvatar
                  name="avatarUrl"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  disabled={isBannable && !isDisable}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary',
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>

              {isEdit && !isBannable && onActive !== 'leave' && (
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
                          disabled={
                            !user.permission_settings.user_create_view_and_edit || isBannable
                          }
                          onChange={(event) => onDelete(event.target.checked ? 'active' : 'banned')}
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
                              onActive === 'active'
                                ? 'success'
                                : onActive === 'banned'
                                ? 'error'
                                : 'warning'
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
                              onActive === 'active'
                                ? 'Active'
                                : onActive === 'banned'
                                ? 'Banned'
                                : 'Leave'
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
              {isEdit && !isBannable && onActive === 'leave' && (
                <Stack alignItems="flex-end">
                  <Button
                    variant="soft"
                    color="warning"
                    onClick={() =>
                      append({
                        joined_at: moment(new Date()).format('YYYY-MM-DD'),
                        released_date: null,
                      })
                    }
                  >
                    Rejoin
                  </Button>
                </Stack>
              )}
              {isEdit && !isBannable && onActive !== 'leave' && (
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
                <Grid item xs={4} sm={2}>
                  <RHFTextField
                    // id="outlined-select-currency"
                    disabled={isBannable && !isDisable}
                    name="title"
                    label="Title *"
                    select
                    variant="outlined"
                  >
                    {titleArray.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </RHFTextField>
                </Grid>
                <Grid item xs={8} sm={5}>
                  <RHFTextField
                    name="first_name"
                    disabled={isBannable && !isDisable}
                    label="First Name *"
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <RHFTextField
                    name="last_name"
                    disabled={isBannable && !isDisable}
                    label="Last Name *"
                  />
                </Grid>
                <Grid item xs={4} sm={2}>
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
                <Grid item xs={8} sm={5}>
                  <RHFTextField
                    name="email"
                    disabled={isBannable && !isDisable}
                    label="Email Address *"
                  />
                </Grid>
                {!isEdit && (
                  <Grid item xs={12} sm={5}>
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
                  <Grid item xs={12} sm={isEdit ? 5 : 6}>
                    <RHFTextField
                      name="billing_rate"
                      type="number"
                      disabled={isBannable && !isDisable}
                      label="Billing Rate (/mo)"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={isBannable ? 5 : 6}>
                  <RHFTextField
                    name="phone_number"
                    disabled={isBannable && !isDisable}
                    label="Phone Number"
                  />
                </Grid>
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

              {fields.map((item, index) => (
                <Grid container spacing={2} key={item.id} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={index === 0 || isBannable ? 6 : 5}>
                    <Controller
                      name={`user_working_history_user_id.${index}.joined_at`}
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
                              id={`user_working_history_user_id.${index}.joined_at`}
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
                  {!isBannable && isEdit && (
                    <Grid item xs={12} sm={index === 0 ? 6 : 5}>
                      <Controller
                        name={`user_working_history_user_id.${index}.released_date`}
                        control={control}
                        defaultValue={null}
                        render={({
                          field: { onChange, value },
                          fieldState: { error, invalid },
                        }) => (
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
                                id={`user_working_history_user_id.${index}.released_date`}
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
                  )}

                  {index !== 0 && !isBannable && (
                    <Grid item xs={12} sm={2}>
                      <Button
                        color="error"
                        sx={{ width: '55px', height: '55px' }}
                        onClick={() => remove(index)}
                      >
                        <Iconify
                          sx={{ width: '22px', height: '22px' }}
                          icon="eva:trash-2-outline"
                        />
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ))}

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
